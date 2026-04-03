const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../config/swagger");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const policyRoutes = require("./policyRoutes");
const claimRoutes = require("./claimRoutes");
const premiumRoutes = require("./premiumRoutes");
const triggerRoutes = require("./triggerRoutes");

const router = express.Router();

router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/policies", policyRoutes);
router.use("/claims", claimRoutes);
router.use("/premium", premiumRoutes);
router.use("/triggers", triggerRoutes);

module.exports = router;
