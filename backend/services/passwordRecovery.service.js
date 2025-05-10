const crypto = require('crypto');
const User = require('../models/user.model');
const { sendEmail } = require('./notification.service');
const { hashPassword } = require('../utils/auth');

class PasswordRecoveryService {
  static async requestReset(email) {
    // 1. Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    // 2. Generate reset token (valid for 1 hour)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry

    // 3. Save token in database
    await User.updateUserResetToken(user.id, resetToken, resetTokenExpiry);

    // 4. Send reset link via email
    const resetLink = `http://yourfrontend.com/reset-password?token=${resetToken}`;
    await sendEmail(
      email,
      'Password Reset Request',
      `Click this link to reset your password: ${resetLink} (Valid for 1 hour)`
    );

    return { success: true, message: 'Password reset link sent to email' };
  }

  static async verifyResetToken(token) {
    // 1. Find user by token
    const user = await User.findByResetToken(token);
    if (!user || new Date() > new Date(user.reset_token_expiry)) {
      throw new Error('Invalid or expired token');
    }

    return { success: true, userId: user.id };
  }

  static async resetPassword(userId, newPassword) {
    // 1. Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // 2. Update password & clear reset token
    await User.updateUserPassword(userId, hashedPassword);
    await User.clearResetToken(userId);

    return { success: true, message: 'Password updated successfully' };
  }
}

module.exports = PasswordRecoveryService;