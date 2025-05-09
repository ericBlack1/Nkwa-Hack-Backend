// backend/utils/verificationMiddleware.js
const User = require('../models/user.model');

const checkPhoneVerified = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user.phone_verified) {
      return res.status(403).json({ 
        message: 'Phone verification required' 
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

const checkEmailVerified = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user.email_verified) {
      return res.status(403).json({ 
        message: 'Email verification required' 
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkPhoneVerified,
  checkEmailVerified
};
