const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const env = require("../config/env");
const userRepository = require("../repositories/userRepository");
const ApiError = require("../utils/apiError");

class AuthService {
  async register(payload) {
    const existingUser = await userRepository.findByPhone(payload.phone);
    if (existingUser) {
      throw new ApiError(409, "User with this phone already exists");
    }

    const passwordHash = await bcrypt.hash(payload.password, 10);

    const user = await userRepository.create({
      name: payload.name,
      phone: payload.phone,
      location: payload.location,
      occupationType: payload.occupationType,
      riskZone: payload.riskZone,
      passwordHash,
    });

    return {
      id: user.id,
      name: user.name,
      phone: user.phone,
      location: user.location,
      occupationType: user.occupationType,
      riskZone: user.riskZone,
    };
  }

  async login({ phone, password }) {
    const user = await userRepository.findByPhone(phone);
    if (!user) {
      throw new ApiError(401, "Invalid phone or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid phone or password");
    }

    const token = jwt.sign(
      {
        sub: user.id,
        phone: user.phone,
        role: user.role,
      },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        location: user.location,
        occupationType: user.occupationType,
        riskZone: user.riskZone,
      },
    };
  }
}

module.exports = new AuthService();
