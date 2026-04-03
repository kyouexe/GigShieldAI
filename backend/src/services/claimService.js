const claimRepository = require("../repositories/claimRepository");
const policyRepository = require("../repositories/policyRepository");
const userRepository = require("../repositories/userRepository");
const disruptionRepository = require("../repositories/disruptionRepository");
const triggerService = require("./triggerService");
const ApiError = require("../utils/apiError");

function generateClaimCode() {
  return `CLM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function isWeatherReason(reason) {
  const value = reason.toLowerCase();
  return value.includes("rain") || value.includes("flood") || value.includes("weather");
}

class ClaimService {
  async createClaim(payload) {
    const [user, policy] = await Promise.all([
      userRepository.findById(payload.userId),
      policyRepository.findByCode(payload.policyId),
    ]);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (!policy) {
      throw new ApiError(404, "Policy not found");
    }

    if (policy.userId !== user.id) {
      throw new ApiError(400, "Policy does not belong to this user");
    }

    // Run trigger evaluation just before adjudication to keep zero-touch claims current.
    await triggerService.checkAndProcessTriggersForUser(user.id);

    const activeDisruptions = await disruptionRepository.findActiveByLocation(user.location);
    const hasRelevantDisruption = activeDisruptions.some((event) => {
      const reason = payload.reason.toLowerCase();
      return reason.includes(event.type.toLowerCase()) || isWeatherReason(reason);
    });

    let status = "PENDING";
    let autoProcessed = false;

    if (hasRelevantDisruption && isWeatherReason(payload.reason)) {
      status = "AUTO_APPROVED";
      autoProcessed = true;
    } else if (isWeatherReason(payload.reason) && !hasRelevantDisruption) {
      status = "REJECTED";
      autoProcessed = true;
    }

    const claim = await claimRepository.create({
      claimCode: generateClaimCode(),
      userId: payload.userId,
      policyId: policy.id,
      reason: payload.reason,
      status,
      autoProcessed,
    });

    return {
      claimId: claim.claimCode,
      userId: claim.userId,
      policyId: payload.policyId,
      reason: claim.reason,
      timestamp: claim.createdAt,
      status: claim.status,
    };
  }

  async getClaimsByUserId(userId) {
    const claims = await claimRepository.findByUserId(userId);

    return claims.map((claim) => ({
      claimId: claim.claimCode,
      userId: claim.userId,
      policyId: claim.policy.policyCode,
      reason: claim.reason,
      timestamp: claim.createdAt,
      status: claim.status,
      autoProcessed: claim.autoProcessed,
    }));
  }
}

module.exports = new ClaimService();
