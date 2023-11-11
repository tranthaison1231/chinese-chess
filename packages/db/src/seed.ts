import * as dotenv from 'dotenv';
dotenv.config();
import { users } from './schema';
import { db } from './connection';

async function run() {
  const data = await db.delete(users);
  console.log(data);
}

run().catch((e) => {
  console.log(e);
  process.exit(1);
});
