const PasswordRecoveryService = require('../services/passwordRecovery.service');

const requestReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await PasswordRecoveryService.requestReset(email);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const verifyToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    const result = await PasswordRecoveryService.verifyResetToken(token);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const verification = await PasswordRecoveryService.verifyResetToken(token);
    const result = await PasswordRecoveryService.resetPassword(
      verification.userId,
      newPassword
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  requestReset,
  verifyToken,
  resetPassword,
};