const NkwaPayService = require("../services/nkwapay.service");
const BlockchainService = require("../services/blockchain.service");

class PaymentController {
  async buyTokens(req, res) {
    try {
      const { amountXAF, phoneNumber } = req.body;
      const userId = req.user.id;

      const result = await NkwaPayService.buyTokens(
        userId,
        amountXAF,
        phoneNumber
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new PaymentController();
