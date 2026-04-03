const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma");
const env = require("../config/env");

dotenv.config();

async function seedAdmin() {
  const passwordHash = await bcrypt.hash(env.adminSeedPassword, 10);

  const admin = await prisma.user.upsert({
    where: {
      phone: env.adminSeedPhone,
    },
    update: {
      name: env.adminSeedName,
      location: env.adminSeedLocation,
      occupationType: env.adminSeedOccupation,
      riskZone: env.adminSeedRiskZone,
      role: "ADMIN",
      passwordHash,
    },
    create: {
      name: env.adminSeedName,
      phone: env.adminSeedPhone,
      location: env.adminSeedLocation,
      occupationType: env.adminSeedOccupation,
      riskZone: env.adminSeedRiskZone,
      role: "ADMIN",
      passwordHash,
    },
  });

  console.log(`Admin ready: ${admin.phone} (${admin.id})`);
}

seedAdmin()
  .catch((error) => {
    console.error("Failed to seed admin:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
