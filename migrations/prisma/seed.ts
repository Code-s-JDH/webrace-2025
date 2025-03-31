import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1️⃣ Vytvoř uživatele
  const password = await bcrypt.hash('test1234', 10);
  const user = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'test@example.com',
      password_hash: password,
    },
  });

  // 2️⃣ Vytvoř objednávky
  await prisma.order.createMany({
    data: [
      {
        id: uuidv4(),
        title: 'Objednávka 1',
        description: 'Testovací popis 1',
        status: 'pending',
        userId: user.id,
        estimatedTime: '2025-04-01T10:00:00.000Z',
        courierId: uuidv4(),
        address: 'Ulice 123, Praha',
        postal: '11000',
        gps: '50.0755,14.4378',
        weight: 1.2,
        size: 'S',
      },
      {
        id: uuidv4(),
        title: 'Objednávka 2',
        description: 'Testovací popis 2',
        status: 'completed',
        userId: user.id,
        estimatedTime: null,
        courierId: null,
        address: null,
        postal: null,
        gps: null,
        weight: null,
        size: null,
      },
    ],
  });

  console.log('✅ Seeding done.');
}

main()
  .catch((e) => {
    console.error('❌ Error while seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
