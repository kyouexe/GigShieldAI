const authService = require("../services/authService");
const { registerSchema, loginSchema } = require("../utils/validators");
const { apiSuccess } = require("../utils/apiResponse");

class AuthController {
  async register(req, res, next) {
    try {
      const payload = registerSchema.parse(req.body);
      const user = await authService.register(payload);
      return apiSuccess(res, user, "User registered successfully", 201);
    } catch (error) {
      return next(error);
    }
  }

  async login(req, res, next) {
    try {
      const payload = loginSchema.parse(req.body);
      const result = await authService.login(payload);
      return apiSuccess(res, result, "Login successful");
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new AuthController();
