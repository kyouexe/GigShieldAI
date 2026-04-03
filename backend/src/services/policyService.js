const policyRepository = require("../repositories/policyRepository");
const userRepository = require("../repositories/userRepository");
const dynamicPricingService = require("./dynamicPricingService");
const ApiError = require("../utils/apiError");

function generatePolicyCode() {
  return `POL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

class PolicyService {
  async createPolicy(payload) {
    const user = await userRepository.findById(payload.userId);
    if (!user) {
      throw new ApiError(404, "User not found for policy assignment");
    }

    const premiumBreakdown = dynamicPricingService.calculatePremiumBreakdown(user);

    const policy = await policyRepository.create({
      policyCode: generatePolicyCode(),
      userId: payload.userId,
      coverageAmount: payload.coverageAmount,
      weeklyPremium: premiumBreakdown.weeklyPremium,
      coverageHours: payload.coverageHours,
      riskCategory: payload.riskCategory,
    });

    return {
      policyId: policy.policyCode,
      userId: policy.userId,
      coverageAmount: policy.coverageAmount,
      weeklyPremium: policy.weeklyPremium,
      coverageHours: policy.coverageHours,
      riskCategory: policy.riskCategory,
      claimEligible: policy.claimEligible,
      eligibilityReason: policy.eligibilityReason,
    };
  }

  async getPoliciesByUserId(userId) {
    const policies = await policyRepository.findByUserId(userId);
    return policies.map((policy) => ({
      policyId: policy.policyCode,
      userId: policy.userId,
      coverageAmount: policy.coverageAmount,
      weeklyPremium: policy.weeklyPremium,
      coverageHours: policy.coverageHours,
      riskCategory: policy.riskCategory,
      claimEligible: policy.claimEligible,
      eligibilityReason: policy.eligibilityReason,
      isActive: policy.isActive,
    }));
  }

  async updatePolicy(policyCode, payload) {
    const existingPolicy = await policyRepository.findByCode(policyCode);
    if (!existingPolicy) {
      throw new ApiError(404, "Policy not found");
    }

    const policy = await policyRepository.updateById(existingPolicy.id, payload);

    return {
      policyId: policy.policyCode,
      userId: policy.userId,
      coverageAmount: policy.coverageAmount,
      weeklyPremium: policy.weeklyPremium,
      coverageHours: policy.coverageHours,
      riskCategory: policy.riskCategory,
      claimEligible: policy.claimEligible,
      eligibilityReason: policy.eligibilityReason,
      isActive: policy.isActive,
    };
  }
}

module.exports = new PolicyService();
