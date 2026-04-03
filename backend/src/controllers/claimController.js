const claimService = require("../services/claimService");
const { createClaimSchema } = require("../utils/validators");
const { apiSuccess } = require("../utils/apiResponse");

class ClaimController {
  async createClaim(req, res, next) {
    try {
      const payload = createClaimSchema.parse(req.body);
      const claim = await claimService.createClaim(payload);
      return apiSuccess(res, claim, "Claim submitted successfully", 201);
    } catch (error) {
      return next(error);
    }
  }

  async getClaimsByUserId(req, res, next) {
    try {
      const claims = await claimService.getClaimsByUserId(req.params.userId);
      return apiSuccess(res, claims, "Claims fetched successfully");
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new ClaimController();
