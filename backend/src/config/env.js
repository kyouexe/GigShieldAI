const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  port: process.env.PORT || 8080,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || "dev-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  triggerCronSchedule: process.env.TRIGGER_CRON_SCHEDULE || "*/15 * * * *",
  enableTriggerCron: process.env.ENABLE_TRIGGER_CRON !== "false",
  weatherApiUrl: process.env.WEATHER_API_URL || "",
  weatherApiKey: process.env.WEATHER_API_KEY || "",
  trafficApiUrl: process.env.TRAFFIC_API_URL || "",
  trafficApiKey: process.env.TRAFFIC_API_KEY || "",
  floodApiUrl: process.env.FLOOD_API_URL || "",
  floodApiKey: process.env.FLOOD_API_KEY || "",
  eventsApiUrl: process.env.EVENTS_API_URL || "",
  eventsApiKey: process.env.EVENTS_API_KEY || "",
  adminSeedName: process.env.ADMIN_SEED_NAME || "GigShield Admin",
  adminSeedPhone: process.env.ADMIN_SEED_PHONE || "9000000000",
  adminSeedPassword: process.env.ADMIN_SEED_PASSWORD || "change-me-now",
  adminSeedLocation: process.env.ADMIN_SEED_LOCATION || "mumbai",
  adminSeedOccupation: process.env.ADMIN_SEED_OCCUPATION || "System Admin",
  adminSeedRiskZone: process.env.ADMIN_SEED_RISK_ZONE || "SAFE",
};
