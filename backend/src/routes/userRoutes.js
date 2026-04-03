const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Fetch user profile by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get("/:id", authMiddleware, (req, res, next) => userController.getUserById(req, res, next));

module.exports = router;
