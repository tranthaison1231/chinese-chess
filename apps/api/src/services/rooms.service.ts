import { db, rooms, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

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
