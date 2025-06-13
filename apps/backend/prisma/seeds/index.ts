import { PrismaClient } from '@prisma/client';
import seedUser from './user.seed';
import salesSeed from './sales.seed';

const prisma = new PrismaClient();

async function main() {
  await seedUser(prisma);
  await salesSeed(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
