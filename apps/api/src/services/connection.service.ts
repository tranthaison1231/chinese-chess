import { User, db } from '@/db/schema';
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';
import { RoomsService } from './rooms.service';
import { UsersService } from './users.service';
import { GamesService } from './games.service';

export class ConnectionService {
  gateway: ApiGatewayManagementApiClient;
  constructor() {
    this.gateway = new ApiGatewayManagementApiClient({
      apiVersion: '2018-11-29',
      endpoint: process.env.IS_OFFLINE === 'true' ? 'ws://localhost:3001' : process.env.APIG_ENDPOINT,
    });
  }
  async joinRoom(roomID: string, user: User) {
    let room = await db.query.rooms.findFirst({
      where: (rooms, { eq }) => eq(rooms.id, roomID),
    });
    if (!room) {
      await RoomsService.create(roomID);
    }
    await UsersService.create(user);
    await UsersService.updateUserOnRoom(user.id, roomID);
  }

  async removeConnection(roomID: string, userID: string) {
    await GamesService.removePlayer(roomID, userID);
    await UsersService.delete(userID);
  }

  async publish(event: AWSLambda.APIGatewayProxyWebsocketEventV2, data: string) {
    const params = {
      ConnectionId: event.requestContext.connectionId,
      Data: data,
    };
    const command = new PostToConnectionCommand(params);
    await this.gateway.send(command);
  }

  async publishToRoom(roomID: string, event: AWSLambda.APIGatewayProxyWebsocketEventV2, data: string) {
    const users = await UsersService.getAllBy(roomID);
    for (const { id } of users) {
      try {
        const params = {
          ConnectionId: id,
          Data: data,
        };
        const command = new PostToConnectionCommand(params);
        await this.gateway.send(command);
      } catch (e) {
        this.removeConnection(roomID, id);
      }
    }
  }
}
