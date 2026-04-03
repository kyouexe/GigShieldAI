const express = require("express");
const claimController = require("../controllers/claimController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/claims:
 *   post:
 *     summary: File a claim
 *     tags: [Claims]
 *     security:
 *       - bearerAuth: []
 */
router.post("/", authMiddleware, (req, res, next) => claimController.createClaim(req, res, next));

/**
 * @swagger
 * /api/claims/{userId}:
 *   get:
 *     summary: Get user claims
 *     tags: [Claims]
 *     security:
 *       - bearerAuth: []
 */
router.get("/:userId", authMiddleware, (req, res, next) => claimController.getClaimsByUserId(req, res, next));

module.exports = router;
