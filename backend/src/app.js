const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const env = require("./config/env");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({
    success: true,
    data: { status: "UP", timestamp: new Date().toISOString() },
    message: "Service is healthy",
  });
});

app.use("/api", routes);
app.use(errorHandler);

module.exports = app;
