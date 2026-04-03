const historicalRiskData = require("../data/historicalRiskData");
const policyRepository = require("../repositories/policyRepository");
const userRepository = require("../repositories/userRepository");
const { getWeatherSignal } = require("./externalDataService");
const ApiError = require("../utils/apiError");

class DynamicPricingService {
  constructor() {
    this.basePremium = 30;
  }

  calculatePremiumBreakdown(user) {
    const riskProfile = historicalRiskData[user.riskZone] || historicalRiskData.SAFE;
    const weather = getWeatherSignal(user.riskZone);

    const locationAdjustment = riskProfile.baseAdjustment;
    const weatherAdjustment = weather.rainForecast ? weather.premiumAdjustment : 0;
    const historicalAdjustment = Math.round(riskProfile.disruptionFrequency * 4);

    const weeklyPremium = Math.max(
      10,
      this.basePremium + locationAdjustment + weatherAdjustment + historicalAdjustment
    );

    return {
      basePremium: this.basePremium,
      adjustments: {
        locationRisk: locationAdjustment,
        weatherForecast: weatherAdjustment,
        historicalRisk: historicalAdjustment,
      },
      weeklyPremium,
      weatherCondition: weather.condition,
      riskZone: user.riskZone,
    };
  }

  async calculateForUser(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return this.calculatePremiumBreakdown(user);
  }

  async updatePremiumsForUserPolicies(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const premiumData = this.calculatePremiumBreakdown(user);
    await policyRepository.updateManyByUserId(userId, {
      weeklyPremium: premiumData.weeklyPremium,
    });

    return premiumData;
  }
}

module.exports = new DynamicPricingService();
