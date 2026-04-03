const express = require("express");
const triggerController = require("../controllers/triggerController");

const router = express.Router();

/**
 * @swagger
 * /api/triggers/check:
 *   get:
 *     summary: Check active triggers
 *     tags: [Triggers]
 */
router.get("/check", (req, res, next) => triggerController.check(req, res, next));

module.exports = router;
