import { PrismaClient } from '@prisma/client';
import seedUser from './user.seed';

const prisma = new PrismaClient();

async function main() {
  await seedUser(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
