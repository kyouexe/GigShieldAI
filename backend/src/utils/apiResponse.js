function apiSuccess(res, data, message = "Request processed successfully", statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
}

function apiFailure(res, message = "Something went wrong", statusCode = 500, errors = null) {
  return res.status(statusCode).json({
    success: false,
    data: errors,
    message,
  });
}

module.exports = {
  apiSuccess,
  apiFailure,
};
