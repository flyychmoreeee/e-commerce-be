import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD || 'SuperAdmin123!';

async function main() {
  const hashedPassword = await bcrypt.hash(
    ADMIN_PASSWORD,
    10,
  );

  const superAdmin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      email: ADMIN_EMAIL,
      username: 'superadmin',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      isVerified: true,
    },
  });

  console.log({ superAdmin });
}

(async () => {
  try {
    await main();
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
