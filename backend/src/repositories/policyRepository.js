const prisma = require("../config/prisma");

class PolicyRepository {
  create(data) {
    return prisma.policy.create({ data });
  }

  findByUserId(userId) {
    return prisma.policy.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  findById(id) {
    return prisma.policy.findUnique({ where: { id } });
  }

  findByCode(policyCode) {
    return prisma.policy.findUnique({ where: { policyCode } });
  }

  updateById(id, data) {
    return prisma.policy.update({ where: { id }, data });
  }

  updateManyByUserId(userId, data) {
    return prisma.policy.updateMany({ where: { userId, isActive: true }, data });
  }

  findActiveByUserId(userId) {
    return prisma.policy.findMany({ where: { userId, isActive: true } });
  }
}

module.exports = new PolicyRepository();
