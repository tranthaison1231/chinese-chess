import { db, rooms } from '@chinese-chess/db';

export class RoomsService {
  static async create(roomID: string) {
    return db.insert(rooms).values({ id: roomID });
  }

  static async getBy(roomID: string) {
    return db.query.rooms.findFirst({
      where: (rooms, { eq }) => eq(rooms.id, roomID),
      with: {
        users: true,
        game: {
          with: {
            player1: true,
            player2: true,
          },
        },
      },
    });
  }
}
