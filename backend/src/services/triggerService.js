const disruptionRepository = require("../repositories/disruptionRepository");
const userRepository = require("../repositories/userRepository");
const policyRepository = require("../repositories/policyRepository");
const dynamicPricingService = require("./dynamicPricingService");
const { getDisruptionSignals } = require("./externalDataService");

function buildExpiry(hours = 6) {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + hours);
  return expiry;
}

class TriggerService {
  async checkAndProcessTriggersForUser(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      return null;
    }

    const { weather, traffic, flood, localEvent, heatwave } = await getDisruptionSignals({
      location: user.location,
      riskZone: user.riskZone,
    });

    const triggeredEvents = [];

    if (weather.trigger) {
      triggeredEvents.push({
        type: "WEATHER",
        severity: weather.condition,
        location: user.location,
        riskZone: user.riskZone,
        description: "Heavy rain or storm disruption detected",
        expiresAt: buildExpiry(6),
      });
    }

    if (traffic.trigger) {
      triggeredEvents.push({
        type: "TRAFFIC",
        severity: traffic.congestionLevel,
        location: user.location,
        riskZone: user.riskZone,
        description: "Traffic congestion disruption detected",
        expiresAt: buildExpiry(4),
      });
    }

    if (flood.alert) {
      triggeredEvents.push({
        type: "FLOOD",
        severity: flood.severity,
        location: user.location,
        riskZone: user.riskZone,
        description: "Flood alert active in this zone",
        expiresAt: buildExpiry(12),
      });
    }

    if (localEvent.hasDisruption) {
      triggeredEvents.push({
        type: "LOCAL_EVENT",
        severity: localEvent.severity,
        location: user.location,
        riskZone: user.riskZone,
        description: localEvent.eventName,
        expiresAt: buildExpiry(8),
      });
    }

    if (heatwave.alert) {
      triggeredEvents.push({
        type: "HEATWAVE",
        severity: `${heatwave.temperature}C`,
        location: user.location,
        riskZone: user.riskZone,
        description: "Heatwave disruption alert",
        expiresAt: buildExpiry(6),
      });
    }

    if (triggeredEvents.length > 0) {
      await disruptionRepository.createMany(triggeredEvents);
      await policyRepository.updateManyByUserId(userId, {
        claimEligible: true,
        eligibilityReason: triggeredEvents.map((event) => event.type).join(", "),
      });

      const premiumData = await dynamicPricingService.updatePremiumsForUserPolicies(userId);

      return {
        userId,
        location: user.location,
        triggeredEvents,
        premiumUpdatedTo: premiumData.weeklyPremium,
        notifications: [
          "Claim eligibility enabled due to active disruptions",
          "Weekly premium adjusted based on dynamic risk signals",
        ],
      };
    }

    await policyRepository.updateManyByUserId(userId, {
      claimEligible: false,
      eligibilityReason: "No active triggers",
    });

    return {
      userId,
      location: user.location,
      triggeredEvents: [],
      notifications: ["No disruptions detected"],
    };
  }

  async checkTriggers() {
    await disruptionRepository.deactivateExpired(new Date());

    const users = await userRepository.findAll();
    const userRuns = [];

    for (const user of users) {
      const result = await this.checkAndProcessTriggersForUser(user.id);
      if (result) {
        userRuns.push(result);
      }
    }

    const activeDisruptions = await disruptionRepository.findRecentActive();

    return {
      checkedAt: new Date().toISOString(),
      totalUsersChecked: userRuns.length,
      totalActiveDisruptions: activeDisruptions.length,
      userRuns,
      activeDisruptions,
    };
  }
}

module.exports = new TriggerService();
