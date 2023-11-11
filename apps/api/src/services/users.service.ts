import { User, db, eq, users } from '@chinese-chess/db';

export class UsersService {
  static async getBy(userID: string) {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userID),
    });
    return user;
  }

  static async create(user: User) {
    await db.insert(users).values(user);
  }

  static async getAllBy(roomID: string): Promise<User[]> {
    const room = await db.query.rooms.findFirst({
      where: (rooms, { eq }) => eq(rooms.id, roomID),
      with: {
        users: true,
      },
    });
    return room?.users ?? [];
  }

  static async delete(userID: string) {
    return db.delete(users).where(eq(users.id, userID));
  }

  static async removeUserOnRoom(userID: string) {
    return db.update(users).set({ roomID: undefined }).where(eq(users.id, userID));
  }
}
