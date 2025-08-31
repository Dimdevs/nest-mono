import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  const pass = await bcrypt.hash('admin12345', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: { email: 'admin@example.com', password: pass, role: 'admin' },
  });

  // demo users + accounts
  const u1 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: { email: 'alice@example.com', password: await bcrypt.hash('password123',10), role: 'user' },
  });
  const u2 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: { email: 'bob@example.com', password: await bcrypt.hash('password123',10), role: 'user' },
  });

  await prisma.account.upsert({
    where: { id: u1.id }, // not by id; we'll create/find by user
    update: {},
    create: { id: u1.id, userId: u1.id, balanceCents: 500000 },
  }).catch(async () => {
    const exist = await prisma.account.findFirst({ where: { userId: u1.id } });
    if (!exist) await prisma.account.create({ data: { userId: u1.id, balanceCents: 500000 } });
  });

  await prisma.account.upsert({
    where: { id: u2.id },
    update: {},
    create: { id: u2.id, userId: u2.id, balanceCents: 100000 },
  }).catch(async () => {
    const exist = await prisma.account.findFirst({ where: { userId: u2.id } });
    if (!exist) await prisma.account.create({ data: { userId: u2.id, balanceCents: 100000 } });
  });

  console.log('Seeded admin, alice, bob with accounts');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
