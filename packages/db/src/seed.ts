import * as dotenv from 'dotenv';
dotenv.config();
import { db } from '.';
import { users } from './schema';

async function run() {
  const data = await db.delete(users);
  console.log(data);
}

run().catch((e) => {
  console.log(e);
  process.exit(1);
});
