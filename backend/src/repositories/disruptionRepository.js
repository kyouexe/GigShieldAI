const prisma = require("../config/prisma");

class DisruptionRepository {
  createMany(events) {
    return prisma.disruptionEvent.createMany({ data: events });
  }

  deactivateExpired(currentTime) {
    return prisma.disruptionEvent.updateMany({
      where: {
        isActive: true,
        expiresAt: { lt: currentTime },
      },
      data: {
        isActive: false,
      },
    });
  }

  findActiveByLocation(location) {
    return prisma.disruptionEvent.findMany({
      where: {
        isActive: true,
        location: { equals: location, mode: "insensitive" },
      },
      orderBy: { detectedAt: "desc" },
    });
  }

  findActiveByRiskZone(riskZone) {
    return prisma.disruptionEvent.findMany({
      where: {
        isActive: true,
        riskZone,
      },
      orderBy: { detectedAt: "desc" },
    });
  }

  findRecentActive() {
    return prisma.disruptionEvent.findMany({
      where: {
        isActive: true,
      },
      orderBy: { detectedAt: "desc" },
      take: 50,
    });
  }
}

module.exports = new DisruptionRepository();
