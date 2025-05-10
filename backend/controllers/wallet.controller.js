const BlockchainService = require("../services/blockchain.service");
const db = require("../config/database");
const { ethers } = require("ethers");

// Convert all methods to proper Express middleware format
const walletController = {
  createWallet: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const wallet = ethers.Wallet.createRandom();

      await db.query(
        `INSERT INTO wallets (user_id, address, private_key_encrypted) 
         VALUES ($1, $2, $3)`,
        [userId, wallet.address, wallet.privateKey] // In production, encrypt this
      );

      res.json({
        address: wallet.address,
        privateKey: wallet.privateKey, // Remove in production
      });
    } catch (error) {
      next(error);
    }
  },

  getWalletBalance: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { rows } = await db.query(
        `SELECT address FROM wallets WHERE user_id = $1`,
        [userId]
      );

      if (!rows.length) {
        return res.status(404).json({ error: "Wallet not found" });
      }

      const blockchainBalance = await BlockchainService.getBalance(
        rows[0].address
      );

      const { rows: balanceRows } = await db.query(
        `SELECT COALESCE(SUM(amount), 0) as balance 
         FROM transactions 
         WHERE wallet_id = (SELECT id FROM wallets WHERE user_id = $1)`,
        [userId]
      );

      res.json({
        address: rows[0].address,
        blockchainBalance,
        internalBalance: balanceRows[0].balance,
      });
    } catch (error) {
      next(error);
    }
  },

  transferTokens: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { recipientAddress, amount } = req.body;

      // Verify balance
      const { rows: balanceRows } = await db.query(
        `SELECT COALESCE(SUM(amount), 0) as balance 
         FROM transactions 
         WHERE wallet_id = (SELECT id FROM wallets WHERE user_id = $1)`,
        [userId]
      );

      if (balanceRows[0].balance < amount) {
        return res.status(400).json({ error: "Insufficient balance" });
      }

      // Execute transfer
      const { rows } = await db.query(
        `SELECT private_key_encrypted FROM wallets WHERE user_id = $1`,
        [userId]
      );

      const signer = new ethers.Wallet(
        rows[0].private_key_encrypted, // In production, decrypt first
        BlockchainService.provider
      );

      const tx = await BlockchainService.tokenContract
        .connect(signer)
        .transfer(recipientAddress, ethers.parseUnits(amount.toString(), 18));

      const receipt = await tx.wait();

      // Record transaction
      await db.query(
        `INSERT INTO transactions 
         (wallet_id, tx_hash, recipient_address, amount, status)
         VALUES (
           (SELECT id FROM wallets WHERE user_id = $1),
           $2, $3, $4, $5
         )`,
        [
          userId,
          receipt.hash,
          recipientAddress,
          amount,
          receipt.status === 1 ? "success" : "failed",
        ]
      );

      res.json({
        txHash: receipt.hash,
        status: receipt.status === 1 ? "success" : "failed",
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = walletController;
