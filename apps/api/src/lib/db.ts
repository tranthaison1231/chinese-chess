import { PrismaClient } from '@prisma/client';

declare global {
  var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;

if (!global.cachedPrisma) {
  global.cachedPrisma = new PrismaClient();
}
prisma = global.cachedPrisma;

export const db = prisma;
