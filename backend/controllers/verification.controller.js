const OTPService = require('../services/otp.service');

const sendPhoneOTP = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const result = await OTPService.sendPhoneOTP(phone);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const sendEmailOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await OTPService.sendEmailOTP(email);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const verifyPhoneOTP = async (req, res, next) => {
  try {
    const { userId, otp } = req.body;
    const result = await OTPService.verifyPhoneOTP(userId, otp);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const verifyEmailOTP = async (req, res, next) => {
  try {
    const { otp } = req.body;
    const userId = req.user.userId; // From JWT
    
    const result = await OTPService.verifyEmailOTP(userId, otp);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: {
        message: error.message,
        code: error.statusCode || 500
      }
    });
  }
};

module.exports = {
  sendPhoneOTP,
  sendEmailOTP,
  verifyPhoneOTP,
  verifyEmailOTP
};
