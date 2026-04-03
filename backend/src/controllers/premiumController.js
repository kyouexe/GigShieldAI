const dynamicPricingService = require("../services/dynamicPricingService");
const triggerService = require("../services/triggerService");
const { apiSuccess } = require("../utils/apiResponse");

class PremiumController {
  async calculatePremium(req, res, next) {
    try {
      const userId = req.params.userId;
      await triggerService.checkAndProcessTriggersForUser(userId);
      const premium = await dynamicPricingService.calculateForUser(userId);
      return apiSuccess(res, premium, "Premium calculated successfully");
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new PremiumController();
