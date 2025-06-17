import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';

let dbContainer: StartedTestContainer;
let prisma: PrismaClient;

beforeAll(async () => {
  dbContainer = await new GenericContainer('postgres:16')
    .withEnvironment({
      POSTGRES_DB: 'test',
      POSTGRES_USER: 'test',
      POSTGRES_PASSWORD: 'test',
    })
    .withExposedPorts(5432)
    .start();

  const port = dbContainer.getMappedPort(5432);
  const host = dbContainer.getHost();

  const dbUrl = `postgresql://test:test@${host}:${port}/test?schema=public`;

  process.env.DATABASE_URL = dbUrl;

  execSync(`npx prisma migrate deploy`, {
    env: {
      ...process.env,
      DATABASE_URL: dbUrl,
    },
  });

  prisma = new PrismaClient();
});

beforeEach(async () => {
  await prisma.sales.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
  await dbContainer.stop();
});
