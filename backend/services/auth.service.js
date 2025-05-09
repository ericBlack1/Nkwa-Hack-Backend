const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { comparePassword } = require('../utils/auth');

class AuthService {
  static async login(identifier, password) {
    // Find user by email or phone
    const user = await User.findByEmailOrPhone(identifier);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return {
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone
      },
      token
    };
  }
}

module.exports = AuthService;
