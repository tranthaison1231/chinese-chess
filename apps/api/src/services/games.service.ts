import { db } from '@/lib/db';
import { Status, Turn } from '@prisma/client';

export class GamesService {
  static async start(gameID: string) {
    const game = await db.game.update({
      where: {
        id: gameID,
      },
      data: {
        status: Status.ACTIVE,
      },
    });
    return game;
  }

  static async findByID(gameID: string) {
    return db.game.findUnique({
      where: {
        id: gameID,
      },
    });
  }

  static async updateTurn(gameID: string, turn: Turn) {
    const game = await db.game.update({
      where: {
        id: gameID,
      },
      data: {
        turn: turn,
      },
    });
    return game;
  }
  static async end(gameID: string) {
    const game = await db.game.update({
      where: {
        id: gameID,
      },
      data: {
        status: Status.PENDING,
      },
    });
    return game;
  }

  static async updateSit(gameID: string, sitID: number, userID: string) {
    if (sitID === 1) {
      return db.game.update({
        where: {
          id: gameID,
        },
        data: {
          player1ID: userID,
        },
      });
    }
    if (sitID === 2) {
      return db.game.update({
        where: {
          id: gameID,
        },
        data: {
          player2ID: userID,
        },
      });
    }
    return null;
  }

  static async removePlayer(gameID: string, userID: string) {
    const game = await this.findByID(gameID);
    if (game?.player1ID === userID) {
      await db.game.update({
        where: {
          id: gameID,
        },
        data: {
          status: Status.PENDING,
          player1ID: null,
        },
      });
    }
    if (game?.player2ID === userID) {
      await db.game.update({
        where: {
          id: gameID,
        },
        data: {
          status: Status.PENDING,
          player2ID: null,
        },
      });
    }
  }

  static async removeSit(gameID: string, sitID: number) {
    if (sitID === 1) {
      return db.game.update({
        where: {
          id: gameID,
        },
        data: {
          player1ID: null,
        },
      });
    }
    if (sitID === 2) {
      return db.game.update({
        where: {
          id: gameID,
        },
        data: {
          player2ID: null,
        },
      });
    }
  }
}
