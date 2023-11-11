import { connect } from '@planetscale/database';
import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { games, rooms, roomsRelations, users, usersRelations, gamesRelations } from './schema';

const connection = connect({
  url: process.env.DATABASE_URL,
});

export const db = drizzle(connection, {
  schema: {
    users,
    rooms,
    games,
    gamesRelations,
    usersRelations,
    roomsRelations,
  },
});
