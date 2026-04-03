const triggerService = require("../services/triggerService");
const { apiSuccess } = require("../utils/apiResponse");

class TriggerController {
  async check(req, res, next) {
    try {
      const result = await triggerService.checkTriggers();
      return apiSuccess(res, result, "Trigger check completed");
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new TriggerController();
