const { ZodError } = require("zod");
const ApiError = require("../utils/apiError");
const { apiFailure } = require("../utils/apiResponse");

function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    return apiFailure(res, "Validation failed", 400, err.errors);
  }

  if (err instanceof ApiError) {
    return apiFailure(res, err.message, err.statusCode, err.details);
  }

  console.error("Unhandled error:", err);
  return apiFailure(res, "Internal server error", 500);
}

module.exports = errorHandler;
