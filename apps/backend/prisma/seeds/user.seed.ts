import { faker } from '@faker-js/faker';
import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export default async function seedUser(prisma: PrismaClient) {
  const dbUsers = await prisma.user.findMany();
  if (dbUsers.length >= 50) {
    console.log('Users already seeded, skipping...');
    return;
  }

  const adminUser: Prisma.UserCreateArgs = {
    data: {
      name: 'Admin',
      email: 'admin@kidstoystore.com',
      passwordHash: bcrypt.hashSync('12345678', 10),
      role: 'ADMIN',
    },
  };

  // Create an array of 49 users with unique emails
  const users: Prisma.UserCreateArgs[] = Array.from({ length: 49 }).map(() => ({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      passwordHash: bcrypt.hashSync('12345678', 10),
      role: 'USER',
    },
  }));

  await prisma.user.create(adminUser);
  await prisma.user.createMany({
    data: users.map((user) => user.data),
  });

  console.log(`Seeded 50 users successfully.`);
}
