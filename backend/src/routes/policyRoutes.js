const express = require("express");
const policyController = require("../controllers/policyController");
const authMiddleware = require("../middlewares/authMiddleware");
const { requireRole } = require("../middlewares/roleMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/policies:
 *   post:
 *     summary: Create policy for user
 *     tags: [Policies]
 *     security:
 *       - bearerAuth: []
 */
router.post("/", authMiddleware, requireRole("ADMIN"), (req, res, next) =>
	policyController.createPolicy(req, res, next)
);

/**
 * @swagger
 * /api/policies/{userId}:
 *   get:
 *     summary: Get policies for a user
 *     tags: [Policies]
 *     security:
 *       - bearerAuth: []
 */
router.get("/:userId", authMiddleware, (req, res, next) => policyController.getPoliciesByUserId(req, res, next));

/**
 * @swagger
 * /api/policies/{policyId}:
 *   put:
 *     summary: Update policy by policyId
 *     tags: [Policies]
 *     security:
 *       - bearerAuth: []
 */
router.put("/:policyId", authMiddleware, requireRole("ADMIN"), (req, res, next) =>
	policyController.updatePolicy(req, res, next)
);

module.exports = router;
