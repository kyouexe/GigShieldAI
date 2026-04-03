const cron = require("node-cron");
const env = require("../config/env");
const triggerService = require("../services/triggerService");

function startTriggerCron() {
  if (!env.enableTriggerCron) {
    console.log("Trigger cron is disabled via ENABLE_TRIGGER_CRON=false");
    return null;
  }

  if (!cron.validate(env.triggerCronSchedule)) {
    console.error(`Invalid TRIGGER_CRON_SCHEDULE: ${env.triggerCronSchedule}`);
    return null;
  }

  const task = cron.schedule(env.triggerCronSchedule, async () => {
    try {
      const result = await triggerService.checkTriggers();
      console.log(
        `[TriggerCron] Checked users=${result.totalUsersChecked}, activeEvents=${result.totalActiveDisruptions}`
      );
    } catch (error) {
      console.error("[TriggerCron] Failed:", error.message);
    }
  });

  console.log(`Trigger cron started with schedule: ${env.triggerCronSchedule}`);
  return task;
}

module.exports = {
  startTriggerCron,
};
