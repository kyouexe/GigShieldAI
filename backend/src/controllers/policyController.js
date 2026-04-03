const policyService = require("../services/policyService");
const { createPolicySchema, updatePolicySchema } = require("../utils/validators");
const { apiSuccess } = require("../utils/apiResponse");

class PolicyController {
  async createPolicy(req, res, next) {
    try {
      const payload = createPolicySchema.parse(req.body);
      const policy = await policyService.createPolicy(payload);
      return apiSuccess(res, policy, "Policy created successfully", 201);
    } catch (error) {
      return next(error);
    }
  }

  async getPoliciesByUserId(req, res, next) {
    try {
      const policies = await policyService.getPoliciesByUserId(req.params.userId);
      return apiSuccess(res, policies, "Policies fetched successfully");
    } catch (error) {
      return next(error);
    }
  }

  async updatePolicy(req, res, next) {
    try {
      const payload = updatePolicySchema.parse(req.body);
      const policy = await policyService.updatePolicy(req.params.policyId, payload);
      return apiSuccess(res, policy, "Policy updated successfully");
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new PolicyController();
