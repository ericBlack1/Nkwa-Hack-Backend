const { Pay } = require("@nkwa-pay/sdk");
const BlockchainService = require("./blockchain.service");
const db = require("../config/database");

class NkwaPayService {
  constructor() {
    this.client = new Pay({
      apiKeyAuth: process.env.NKWAPAY_API_KEY,
      serverURL:
        process.env.NODE_ENV === "production"
          ? "https://api.pay.mynkwa.com"
          : "https://api.sandbox.pay.mynkwa.com",
    });
  }

  // Initiate XAF to AFC conversion
  async buyTokens(userId, amountXAF, phoneNumber) {
    // 1. Get user wallet
    const { rows } = await db.query(
      `SELECT address FROM wallets WHERE user_id = $1`,
      [userId]
    );

    if (rows.length === 0) {
      throw new Error("User wallet not found");
    }

    const walletAddress = rows[0].address;

    // 2. Calculate AFC amount (example rate: 1000 XAF = 1 AFC)
    const afcAmount = amountXAF / 1000;

    // 3. Initiate NkwaPay collection
    const payment = await this.client.collect.post({
      requestBody: {
        amount: Math.round(amountXAF * 100), // Convert to cents
        phoneNumber,
        description: `Purchase of ${afcAmount} AFC tokens`,
      },
    });

    // 4. Store pending transaction
    await db.query(
      `INSERT INTO fiat_transactions 
       (user_id, payment_id, amount_xaf, amount_afc, status)
       VALUES ($1, $2, $3, $4, 'pending')`,
      [userId, payment.payment.id, amountXAF, afcAmount]
    );

    // 5. Start payment status polling
    this.pollPaymentStatus(
      payment.payment.id,
      userId,
      walletAddress,
      afcAmount
    );

    return {
      paymentId: payment.payment.id,
      afcAmount,
      status: "pending",
    };
  }

  // Poll payment status
  async pollPaymentStatus(paymentId, userId, walletAddress, afcAmount) {
    let status = "pending";
    let attempts = 0;
    const maxAttempts = 12; // 1 minute polling (5s interval)

    while (status === "pending" && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const result = await this.client.payments.get({ id: paymentId });
      status = result.payment.status;
      attempts++;
    }

    // Update transaction status
    if (status === "successful") {
      // Mint tokens to user's wallet
      await BlockchainService.mint(walletAddress, afcAmount);

      await db.query(
        `UPDATE fiat_transactions 
         SET status = 'completed'
         WHERE payment_id = $1`,
        [paymentId]
      );
    } else {
      await db.query(
        `UPDATE fiat_transactions 
         SET status = 'failed'
         WHERE payment_id = $1`,
        [paymentId]
      );
    }
  }
}

module.exports = new NkwaPayService();
