import { beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';

// Test database client
export const prisma = new PrismaClient({
  datasourceUrl: process.env['DATABASE_TEST_URL'] || process.env['DATABASE_URL'],
});

beforeAll(async () => {
  // Ensure test database is ready
  await prisma.$connect();
});

beforeEach(async () => {
  // Clean up database before each test
  // Run in transaction to ensure atomicity
  const tablenames = await prisma.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    AND tablename NOT LIKE '_prisma%'
    AND tablename NOT IN ('spatial_ref_sys')
  `;

  const tables = tablenames.map(({ tablename }) => tablename);

  // Disable triggers and truncate in correct order
  if (tables.length > 0) {
    await prisma.$executeRawUnsafe(`SET session_replication_role = 'replica';`);

    for (const table of tables.reverse()) {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
    }

    await prisma.$executeRawUnsafe(`SET session_replication_role = 'origin';`);
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});
