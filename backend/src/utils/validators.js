const { z } = require("zod");

const riskZoneEnum = z.enum(["SAFE", "FLOOD_PRONE", "HIGH_RISK"]);
const riskCategoryEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(8).max(20),
  location: z.string().min(2).max(100),
  occupationType: z.string().min(2).max(100),
  riskZone: riskZoneEnum,
  password: z.string().min(6).max(128),
});

const loginSchema = z.object({
  phone: z.string().min(8).max(20),
  password: z.string().min(6).max(128),
});

const createPolicySchema = z.object({
  userId: z.string().min(5),
  coverageAmount: z.number().positive(),
  coverageHours: z.number().int().positive(),
  riskCategory: riskCategoryEnum,
});

const updatePolicySchema = z.object({
  coverageAmount: z.number().positive().optional(),
  weeklyPremium: z.number().positive().optional(),
  coverageHours: z.number().int().positive().optional(),
  riskCategory: riskCategoryEnum.optional(),
  claimEligible: z.boolean().optional(),
  eligibilityReason: z.string().max(300).optional(),
  isActive: z.boolean().optional(),
});

const createClaimSchema = z.object({
  userId: z.string().min(5),
  policyId: z.string().min(5),
  reason: z.string().min(3).max(300),
});

module.exports = {
  registerSchema,
  loginSchema,
  createPolicySchema,
  updatePolicySchema,
  createClaimSchema,
};
