const app = require("./app");
const env = require("./config/env");
const { startTriggerCron } = require("./jobs/triggerCron");

app.listen(env.port, () => {
  console.log(`GigShield backend running on port ${env.port}`);
  startTriggerCron();
});
