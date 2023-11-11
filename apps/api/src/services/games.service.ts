import { Game, db, eq, games } from '@chinese-chess/db';

export class GamesService {
  static async start(gameID: string) {
    const game = await db
      .update(games)
      .set({
        status: 'ACTIVE',
      })
      .where(eq(games.id, gameID));
    return game;
  }

  static async create(game: Pick<Game, 'id' | 'roomID'>) {
    return db.insert(games).values(game);
  }

  static async findByID(gameID: string): Promise<Game | undefined> {
    return db.query.games.findFirst({
      where: (games, { eq }) => eq(games.id, gameID),
    });
  }

  static async updateTurn(gameID: string, turn: Game['turn']) {
    const game = await db
      .update(games)
      .set({
        turn: turn,
      })
      .where(eq(games.id, gameID));
    return game;
  }

  static async end(gameID: string) {
    const game = await db
      .update(games)
      .set({
        status: 'PENDING',
      })
      .where(eq(games.id, gameID));
    return game;
  }

  static async updateSit(gameID: string, sitID: number, userID: string) {
    if (sitID === 1) {
      return db
        .update(games)
        .set({
          player1ID: userID,
        })
        .where(eq(games.id, gameID));
    }
    if (sitID === 2) {
      return db
        .update(games)
        .set({
          player2ID: userID,
        })
        .where(eq(games.id, gameID));
    }
    return null;
  }

  static async removePlayer(gameID: string, userID: string) {
    const game = await this.findByID(gameID);
    if (game?.player1ID === userID) {
      await db
        .update(games)
        .set({
          status: 'PENDING',
          player1ID: null,
        })
        .where(eq(games.id, gameID));
    }
    if (game?.player2ID === userID) {
      await db
        .update(games)
        .set({
          status: 'PENDING',
          player2ID: null,
        })
        .where(eq(games.id, gameID));
    }
  }

  static async removeSit(gameID: string, sitID: number) {
    if (sitID === 1) {
      return db
        .update(games)
        .set({
          player1ID: null,
        })
        .where(eq(games.id, gameID));
    }
    if (sitID === 2) {
      return db
        .update(games)
        .set({
          player2ID: null,
        })
        .where(eq(games.id, gameID));
    }
  }
}
