import {
  enterRoom,
  leaveRoom,
  sendMessage,
  endGame,
  playerSit,
  removeSit,
  startGame,
  moveGame,
  call,
  acceptCall,
  negotiateCall,
  negotiateDone,
} from "@/lib/actions";
import { ACTIONS } from "@chinese-chess/utils";

export async function onConnect(
  _event: AWSLambda.APIGatewayProxyWebsocketEventV2
) {
  return {
    statusCode: 200,
  };
}

export async function onDisconnect(
  event: AWSLambda.APIGatewayProxyWebsocketEventV2
) {
  return leaveRoom(event);
}

export async function onHandler(
  event: AWSLambda.APIGatewayProxyWebsocketEventV2
) {
  const body = JSON.parse(event.body ?? "{}");

  console.log("body", body);

  switch (body.action) {
    case ACTIONS.ROOM.ENTER:
      await enterRoom(event);
      break;
    case ACTIONS.ROOM.LEAVE:
      await leaveRoom(event);
      break;
    case ACTIONS.ROOM.MESSAGE:
      await sendMessage(event);
      break;
    case ACTIONS.GAME.SIT:
      await playerSit(event);
      break;
    case ACTIONS.GAME.REMOVE_SIT:
      await removeSit(event);
      break;
    case ACTIONS.GAME.MOVE:
      await moveGame(event);
      break;
    case ACTIONS.GAME.START:
      await startGame(event);
      break;
    case ACTIONS.GAME.END:
      await endGame(event);
      break;
    case ACTIONS.VOICE.MAKE_CALL:
      await call(event);
      break;
    case ACTIONS.VOICE.ACCEPTED_CALL:
      await acceptCall(event);
      break;
    case ACTIONS.VOICE.NEGOTIATION:
      await negotiateCall(event);
      break;
    case ACTIONS.VOICE.NEGOTIATION_DONE:
      await negotiateDone(event);
      break;

    default:
      break;
  }
  return {
    statusCode: 200,
  };
}
