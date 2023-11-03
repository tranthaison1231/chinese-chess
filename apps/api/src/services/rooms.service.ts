import { db } from '@/lib/db';

export class RoomsService {
  static async getBy(roomID: string) {
    return db.room.findUnique({
      where: {
        id: roomID,
      },
      include: {
        users: true,
        game: {
          include: {
            player1: true,
            player2: true,
          },
        },
      },
    });
  }

  static async removeUserOnRoom(roomID: string, userID: string) {
    return db.room.update({
      where: {
        id: roomID,
      },
      data: {
        users: {
          delete: {
            id: userID,
          },
        },
      },
    });
  }
}
