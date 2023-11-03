import { db } from '@/lib/db';
import { User } from '@prisma/client';

export class UsersService {
  static async getBy(userID: string) {
    const user = await db.user.findUnique({
      where: {
        id: userID,
      },
    });
    return user;
  }

  static async create(user: User) {
    return db.user.create({
      data: user,
    });
  }

  static async getAllBy(roomID: string) {
    const room = await db.room.findUnique({
      where: {
        id: roomID,
      },
      include: {
        users: true,
      },
    });
    return room?.users ?? [];
  }

  static async delete(userID: string) {
    return db.user.deleteMany({
      where: {
        id: userID,
      },
    });
  }
}
