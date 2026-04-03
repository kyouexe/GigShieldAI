const prisma = require("../config/prisma");

class UserRepository {
  create(data) {
    return prisma.user.create({ data });
  }

  findAll() {
    return prisma.user.findMany();
  }

  findByPhone(phone) {
    return prisma.user.findUnique({ where: { phone } });
  }

  findById(id) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        policies: true,
      },
    });
  }
}

module.exports = new UserRepository();
