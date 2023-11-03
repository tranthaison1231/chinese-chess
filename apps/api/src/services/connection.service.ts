import { db } from '@/lib/db';
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';
import { Status, User } from '@prisma/client';
import { UsersService } from './users.service';
import { RoomsService } from './rooms.service';
import { GamesService } from './games.service';

export class ConnectionService {
  gateway: ApiGatewayManagementApiClient;
  constructor() {
    this.gateway = new ApiGatewayManagementApiClient({
      apiVersion: '2018-11-29',
      endpoint: process.env.APIG_ENDPOINT,
    });
  }
  async joinRoom(roomID: string, user: User) {
    const createdUser = await UsersService.create(user);
    let room = await db.room.findUnique({
      where: {
        id: roomID,
      },
    });
    if (room) {
      await db.room.update({
        where: {
          id: roomID,
        },
        data: {
          users: {
            connectOrCreate: {
              where: {
                id: createdUser.id,
              },
              create: {
                id: createdUser.id,
                username: user.username,
              },
            },
          },
        },
      });
    } else {
      room = await db.room.create({
        data: {
          id: roomID,
          users: {
            connect: {
              id: createdUser.id,
            },
          },
          game: {
            create: {
              id: roomID,
            },
          },
        },
      });
    }
    return {
      room,
      user: createdUser,
    };
  }

  async removeConnection(roomID: string, userID: string) {
    await GamesService.removePlayer(roomID, userID);
    const room = await RoomsService.removeUserOnRoom(roomID, userID);
    await UsersService.delete(userID);
    return room;
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
