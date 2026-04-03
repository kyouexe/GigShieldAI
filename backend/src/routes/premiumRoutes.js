const express = require("express");
const premiumController = require("../controllers/premiumController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/premium/calculate/{userId}:
 *   get:
 *     summary: Calculate dynamic premium for user
 *     tags: [Pricing]
 *     security:
 *       - bearerAuth: []
 */
router.get("/calculate/:userId", authMiddleware, (req, res, next) =>
  premiumController.calculatePremium(req, res, next)
);

module.exports = router;
