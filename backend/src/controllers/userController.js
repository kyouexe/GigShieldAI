const userService = require("../services/userService");
const { apiSuccess } = require("../utils/apiResponse");

class UserController {
  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);
      return apiSuccess(res, user, "User fetched successfully");
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new UserController();
