import { GamesService } from "@/services/games.service";
import { ACTIONS } from "@chinese-chess/utils";
import { ConnectionService } from "@/services/connection.service";
import { RoomsService } from "@/services/rooms.service";
import { UsersService } from "@/services/users.service";

let connection;

export const enterRoom = async (
  event: AWSLambda.APIGatewayProxyWebsocketEventV2
) => {
  connection = new ConnectionService();
  const body = JSON.parse(event.body ?? "{}");
  const { roomID } = body;
  let { username } = body;
  if (!username) {
    username = event.requestContext.connectionId;
  }
  try {
    await connection.joinRoom(roomID, {
      id: event.requestContext.connectionId,
      username,
      roomID,
    });
    const room = await RoomsService.getBy(roomID);
    const user = {
      id: event.requestContext.connectionId,
      username: username,
      roomID: roomID,
    };
    await Promise.all([
      connection.publishToRoom(
        roomID,
        event,
        JSON.stringify({
          action: ACTIONS.ROOM.INFO,
          room: room,
        })
      ),
      connection.publishToRoom(
        roomID,
        event,
        JSON.stringify({
          action: ACTIONS.ROOM.MESSAGE,
          username: "System",
          content: `${user.username} has joined the room`,
        })
      ),
      connection.publish(
        event,
        JSON.stringify({
          action: ACTIONS.ROOM.ME,
          me: user,
        })
      ),
    ]);
    return {
      statusCode: 200,
    };
  } catch (error) {
    console.error(error);
  }
};

export const playerSit = async (
  event: AWSLambda.APIGatewayProxyWebsocketEventV2
) => {
  connection = new ConnectionService();
  const body = JSON.parse(event.body ?? "{}");
  const { roomID, gameID, sitID } = body;
  try {
    await GamesService.updateSit(
      gameID,
      +sitID,
      event.requestContext.connectionId
    );
    const room = await RoomsService.getBy(roomID);
    await connection.publishToRoom(
      roomID,
      event,
      JSON.stringify({
        action: ACTIONS.ROOM.INFO,
        room: room,
      })
    );
    return {
      statusCode: 200,
    };
  } catch (error) {
    console.error(error);
  }
};

export const startGame = async (
  event: AWSLambda.APIGatewayProxyWebsocketEventV2
) => {
  connection = new ConnectionService();
  const body = JSON.parse(event.body ?? "{}");
  const { gameID, roomID } = body;
  try {
    await GamesService.start(gameID);
    const room = await RoomsService.getBy(roomID);
    await connection.publishToRoom(
      roomID,
      event,
      JSON.stringify({
        action: ACTIONS.ROOM.INFO,
        room: room,
      })
    );
    return {
      statusCode: 200,
    };
  } catch (error) {
    console.error(error);
  }
};

export const moveGame = async (
  event: AWSLambda.APIGatewayProxyWebsocketEventV2
) => {
  connection = new ConnectionService();
  const body = JSON.parse(event.body ?? "{}");
  const { roomID, from, to, gameID, turn } = body;
  try {
    await GamesService.updateTurn(gameID, turn === "RED" ? "BLACK" : "RED");
    const room = await RoomsService.getBy(roomID);
    await connection.publishToRoom(
      roomID,
      event,
      JSON.stringify({
        action: ACTIONS.GAME.MOVE,
        from: from,
        room: room,
        to: to,
      })
    );
    return {
      statusCode: 200,
    };
  } catch (error) {
    console.error(error);
  }
};

export const leaveRoom = async (
  event: AWSLambda.APIGatewayProxyWebsocketEventV2
) => {
  const { connectionId } = event.requestContext;
  try {
    const connection = new ConnectionService();
    const user = await UsersService.getBy(connectionId);
    if (user?.roomID) {
      const room = await RoomsService.getBy(user.roomID);
      if (
        room?.game?.status === "ACTIVE" &&
        (room?.game?.player1ID === user.id || room?.game?.player2ID === user.id)
      ) {
        await connection.publishToRoom(
          user.roomID,
          event,
          JSON.stringify({
            action: ACTIONS.GAME.END,
            winner:
              user.id === room?.game?.player1ID
                ? room?.game?.player2
                : room?.game?.player1,
          })
        );
      }
      const updatedRoom = await connection.removeConnection(
        user.roomID,
        connectionId
      );
      await Promise.all([
        connection.publishToRoom(
          user.roomID,
          event,
          JSON.stringify({
            action: ACTIONS.ROOM.INFO,
            room: updatedRoom,
          })
        ),
        connection.publishToRoom(
          user.roomID,
          event,
          JSON.stringify({
            action: ACTIONS.ROOM.MESSAGE,
            username: "System",
            content: `${user.username} has left the room`,
          })
        ),
      ]);

      return {
        statusCode: 200,
      };
    }
  } catch (error) {
    console.error(error);
  }
};

export const sendMessage = async (
  event: AWSLambda.APIGatewayProxyWebsocketEventV2
) => {
  connection = new ConnectionService();
  const body = JSON.parse(event.body ?? "{}");
  const { roomID, content, user } = body;
  try {
    await connection.publishToRoom(
      roomID,
      event,
      JSON.stringify({
        action: ACTIONS.ROOM.MESSAGE,
        username: user.username,
        content,
      })
    );
    return {
      statusCode: 200,
    };
  } catch (error) {
    console.error(error);
  }
};

export const removeSit = async (
  event: AWSLambda.APIGatewayProxyWebsocketEventV2
) => {
  connection = new ConnectionService();
  const body = JSON.parse(event.body ?? "{}");
  const { roomID, gameID, sitID } = body;
  try {
    await GamesService.removeSit(gameID, +sitID);
    const room = await RoomsService.getBy(roomID);
    await connection.publishToRoom(
      roomID,
      event,
      JSON.stringify({
        action: ACTIONS.ROOM.INFO,
        room: room,
      })
    );
    return {
      statusCode: 200,
    };
  } catch (error) {
    console.error(error);
  }
};

export const endGame = async (
  event: AWSLambda.APIGatewayProxyWebsocketEventV2
) => {
  connection = new ConnectionService();
  const body = JSON.parse(event.body ?? "{}");
  const { gameID, roomID, winner } = body;
  try {
    await GamesService.end(gameID);
    const room = await RoomsService.getBy(roomID);
    await Promise.all([
      connection.publishToRoom(
        roomID,
        event,
        JSON.stringify({
          action: ACTIONS.ROOM.INFO,
          room: room,
        })
      ),
      connection.publishToRoom(
        roomID,
        event,
        JSON.stringify({
          action: ACTIONS.GAME.END,
          winner: winner,
        })
      ),
    ]);
    return {
      statusCode: 200,
    };
  } catch (error) {
    console.error(error);
  }
};

export const call = async (
  event: AWSLambda.APIGatewayProxyWebsocketEventV2
) => {
  connection = new ConnectionService();
  const body = JSON.parse(event.body ?? "{}");
  const { roomID, offer } = body;

  await connection.publishToRoom(
    roomID,
    event,
    JSON.stringify({
      action: ACTIONS.VOICE.INCOMING_CALL,
      offer,
      from: event.requestContext.connectionId,
    }),
    true
  );

  try {
    return {
      statusCode: 200,
    };
  } catch (error) {
    console.error(error);
  }
};

export const acceptCall = async (
  event: AWSLambda.APIGatewayProxyWebsocketEventV2
) => {
  connection = new ConnectionService();
  const body = JSON.parse(event.body ?? "{}");

  const { from, answer } = body;

  await connection.publishToId(
    from,
    JSON.stringify({
      action: ACTIONS.VOICE.ACCEPTED_CALL,
      answer,
    })
  );
};

export const negotiateCall = async (
  event: AWSLambda.APIGatewayProxyWebsocketEventV2
) => {
  connection = new ConnectionService();
  const body = JSON.parse(event.body ?? "{}");
  const { roomID, offer } = body;

  await connection.publishToRoom(
    roomID,
    event,
    JSON.stringify({
      action: ACTIONS.VOICE.NEGOTIATING,
      offer,
      from: event.requestContext.connectionId,
    }),
    true
  );

  try {
    return {
      statusCode: 200,
    };
  } catch (error) {
    console.error(error);
  }
};

export const negotiateDone = async (
  event: AWSLambda.APIGatewayProxyWebsocketEventV2
) => {
  connection = new ConnectionService();
  const body = JSON.parse(event.body ?? "{}");
  const { roomID, answer } = body;

  await connection.publishToRoom(
    roomID,
    event,
    JSON.stringify({
      action: ACTIONS.VOICE.NEGOTIATION_DONE,
      answer,
      from: event.requestContext.connectionId,
    }),
    true
  );

  try {
    return {
      statusCode: 200,
    };
  } catch (error) {
    console.error(error);
  }
};
