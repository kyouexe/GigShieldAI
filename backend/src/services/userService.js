const userRepository = require("../repositories/userRepository");
const ApiError = require("../utils/apiError");

class UserService {
  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return {
      id: user.id,
      name: user.name,
      phone: user.phone,
      location: user.location,
      occupationType: user.occupationType,
      riskZone: user.riskZone,
      policies: user.policies,
    };
  }
}

module.exports = new UserService();
