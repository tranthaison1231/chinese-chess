import { enterRoom, leaveRoom, sendMessage, endGame, playerSit, removeSit, startGame, moveGame } from '@/lib/actions';
import { ACTIONS } from '@/lib/constants';

export async function onConnect(event: AWSLambda.APIGatewayProxyWebsocketEventV2) {
  return {
    statusCode: 200,
  };
}

export async function onDisconnect(event: AWSLambda.APIGatewayProxyWebsocketEventV2) {
  return leaveRoom(event);
}

export async function onHandler(event: AWSLambda.APIGatewayProxyWebsocketEventV2) {
  const body = JSON.parse(event.body ?? '{}');

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
    default:
      break;
  }

  return {
    statusCode: 200,
  };
}
