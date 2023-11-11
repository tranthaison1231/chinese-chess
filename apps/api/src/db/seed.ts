import { db, games } from './schema';

async function run() {
  const data = await db.delete(games);
  console.log(data);
}

run().catch((e) => {
  console.log(e);
  process.exit(1);
});
