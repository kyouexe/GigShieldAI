const prisma = require("../config/prisma");

class ClaimRepository {
  create(data) {
    return prisma.claim.create({ data });
  }

  findByUserId(userId) {
    return prisma.claim.findMany({
      where: { userId },
      include: {
        policy: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }
}

module.exports = new ClaimRepository();
