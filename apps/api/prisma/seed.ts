import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  const data = await prisma.room.findMany({
    include: {
      game: true,
    },
  });
  console.log(data);
}

run()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
