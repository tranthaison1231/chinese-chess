import { relations } from 'drizzle-orm';
import { mysqlEnum, mysqlTable, uniqueIndex, varchar } from 'drizzle-orm/mysql-core';

export const users = mysqlTable(
  'User',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    username: varchar('username', { length: 256 }),
    roomID: varchar('roomID', { length: 36 }),
  },
  (User) => ({
    roomIndex: uniqueIndex('room_idx').on(User.roomID),
  })
);

export type User = typeof users.$inferSelect;

export const rooms = mysqlTable(
  'Room',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
  },
  (Room) => ({
    index: uniqueIndex('room_idx').on(Room.id),
  })
);

export const games = mysqlTable(
  'Game',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    roomID: varchar('roomID', { length: 36 })
      .notNull()
      .references(() => rooms.id),
    turn: mysqlEnum('Turn', ['RED', 'BLACK'])
      .notNull()
      .$defaultFn(() => 'RED'),
    status: mysqlEnum('Status', ['PENDING', 'ACTIVE'])
      .notNull()
      .$defaultFn(() => 'PENDING'),
    player1ID: varchar('player1ID', { length: 36 }).references(() => users.id),
    player2ID: varchar('player2ID', { length: 36 }).references(() => users.id),
  },
  (Game) => ({
    roomIndex: uniqueIndex('room_idx').on(Game.roomID),
  })
);

export type Game = typeof games.$inferSelect;

export const usersRelations = relations(users, ({ one }) => ({
  room: one(rooms, {
    fields: [users.roomID],
    references: [rooms.id],
  }),
}));

export const roomsRelations = relations(rooms, ({ one, many }) => ({
  game: one(games, {
    fields: [rooms.id],
    references: [games.roomID],
  }),
  users: many(users),
}));

export type Room = typeof games.$inferSelect;

export const gamesRelations = relations(games, ({ one }) => ({
  room: one(rooms, {
    fields: [games.roomID],
    references: [rooms.id],
  }),
  player1: one(users, {
    fields: [games.player1ID],
    references: [users.id],
  }),
  player2: one(users, {
    fields: [games.player2ID],
    references: [users.id],
  }),
}));
