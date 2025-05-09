const express = require("express");
const router = express.Router();
const WalletController = require("../controllers/wallet.controller");
const authMiddleware = require("../utils/auth");

// Create wallet (authenticated)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const wallet = await WalletController.createWallet(req.user.id);
    res.json(wallet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get wallet balance
router.get("/balance", authMiddleware, async (req, res) => {
  try {
    const balance = await WalletController.getWalletBalance(req.user.id);
    res.json(balance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Transfer tokens
router.post("/transfer", authMiddleware, async (req, res) => {
  try {
    const { recipientAddress, amount } = req.body;
    const result = await WalletController.transferTokens(
      req.user.id,
      recipientAddress,
      amount
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
