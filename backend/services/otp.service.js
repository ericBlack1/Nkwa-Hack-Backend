// backend/services/otp.service.js
const crypto = require('crypto');
const { query } = require('../config/database');
const logger = require('../utils/logger');
const { sendSMS, sendEmail } = require('./notification.service');
const User = require('../models/user.model');

class OTPService {
  static async generateOTP() {
    // Generate 6-digit numeric OTP
    return crypto.randomInt(100000, 999999).toString();
  }

  static async sendPhoneOTP(phoneNumber) {
    const otp = await this.generateOTP();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry
    
    // Store in database (you'll need to implement updateUserOTP in User model)
    await User.updateUserOTP({
      phone: phoneNumber,
      phone_otp: otp,
      phone_otp_expiry: expiry
    });

    // Send SMS
    await sendSMS(phoneNumber, `Your verification code is: ${otp}`);
    
    return { success: true, message: 'OTP sent to phone' };
  }

  static async sendEmailOTP(email) {
    const otp = await this.generateOTP();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry
    
    // Store in database
    await User.updateUserOTP({
      email,
      email_otp: otp,
      email_otp_expiry: expiry
    });

    // Send Email
    await sendEmail(email, 'Verification Code', `Your verification code is: ${otp}`);
    
    return { success: true, message: 'OTP sent to email' };
  }

  static async verifyPhoneOTP(userId, otp) {
    const user = await User.findById(userId);
    
    if (!user || user.phone_otp !== otp) {
      throw new Error('Invalid OTP');
    }
    
    if (new Date() > new Date(user.phone_otp_expiry)) {
      throw new Error('OTP expired');
    }
    
    // Update verification status
    await User.updateUserVerification(userId, {
      phone_verified: true,
      phone_otp: null,
      phone_otp_expiry: null
    });
    
    return { success: true, message: 'Phone verified successfully' };
  }

  static async verifyEmailOTP(userId, otp) {
  try {
    console.log(`Verifying OTP for user: ${userId}`); // Debug log
    
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found. Please ensure you are logged in correctly.');
    }

    // Additional validation checks
    if (!user.email_otp) {
      throw new Error('No OTP requested for this email');
    }

    if (user.email_otp !== otp) {
      throw new Error('Invalid OTP code');
    }

    if (new Date() > new Date(user.email_otp_expiry)) {
      throw new Error('OTP has expired. Please request a new one.');
    }

    // Update verification status
    await User.updateUserVerification(userId, {
      email_verified: true,
      email_otp: null,
      email_otp_expiry: null
    });

    return { 
      success: true, 
      message: 'Email successfully verified' 
    };
    
  } catch (error) {
    console.error('OTP verification failed:', error);
    throw error; // Re-throw for controller to handle
  }
}
}

module.exports = OTPService;
