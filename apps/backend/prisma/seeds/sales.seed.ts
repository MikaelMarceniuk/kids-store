import { PrismaClient, Role } from '@prisma/client';

export default async function salesSeed(prisma: PrismaClient) {
  const users = await prisma.user.findMany({
    where: {
      role: Role.USER,
    },
  });

  for (const user of users) {
    const salesCount = Math.floor(Math.random() * 11); // entre 0 e 10

    const sales = Array.from({ length: salesCount }).map(() => {
      const amount = Math.floor(Math.random() * 5) + 1; // entre 1 e 5
      const price = parseFloat((Math.random() * 90 + 10).toFixed(2)); // entre 10 e 100
      const daysAgo = Math.floor(Math.random() * 30); // até 30 dias atrás
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);

      return {
        amount,
        price,
        date,
        userId: user.id,
      };
    });

    if (sales.length > 0) {
      await prisma.sales.createMany({
        data: sales,
      });
    }
  }

  console.log('Sales seed completed.');
}
