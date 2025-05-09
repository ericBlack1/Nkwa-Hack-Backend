const BlockchainService = require("../services/blockchain.service");
const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");

class WalletController {
  // Create new wallet for user
  async createWallet(userId) {
    // Generate a new Ethereum address
    const wallet = ethers.Wallet.createRandom();

    // Store in database
    await db.query(
      `INSERT INTO wallets (user_id, address, private_key_encrypted) 
       VALUES ($1, $2, $3)`,
      [userId, wallet.address, encryptPrivateKey(wallet.privateKey)]
    );

    return {
      address: wallet.address,
      privateKey: wallet.privateKey, // Only for demo - don't do this in production!
    };
  }

  // Get wallet balance (both on-chain and in our DB)
  async getWalletBalance(userId) {
    // Get wallet from DB
    const { rows } = await db.query(
      `SELECT address FROM wallets WHERE user_id = $1`,
      [userId]
    );

    if (rows.length === 0) {
      throw new Error("Wallet not found");
    }

    const walletAddress = rows[0].address;

    // Get on-chain balance
    const blockchainBalance = await BlockchainService.getBalance(walletAddress);

    // Get internal accounting balance
    const { rows: balanceRows } = await db.query(
      `SELECT COALESCE(SUM(amount), 0) as balance 
       FROM transactions 
       WHERE wallet_id = (
         SELECT id FROM wallets WHERE user_id = $1
       )`,
      [userId]
    );

    return {
      address: walletAddress,
      blockchainBalance,
      internalBalance: balanceRows[0].balance,
    };
  }

  // Transfer tokens
  async transferTokens(userId, recipientAddress, amount) {
    // 1. Verify user has sufficient balance
    const wallet = await this.getWalletBalance(userId);
    if (Number(wallet.internalBalance) < amount) {
      throw new Error("Insufficient balance");
    }

    // 2. Get wallet private key (in production, use secure HSM)
    const { rows } = await db.query(
      `SELECT private_key_encrypted FROM wallets WHERE user_id = $1`,
      [userId]
    );
    const privateKey = decryptPrivateKey(rows[0].private_key_encrypted);

    // 3. Execute blockchain transfer
    const walletSigner = new ethers.Wallet(
      privateKey,
      BlockchainService.provider
    );
    const tokenWithSigner =
      BlockchainService.tokenContract.connect(walletSigner);

    const amountWei = ethers.parseUnits(amount.toString(), 18);
    const tx = await tokenWithSigner.transfer(recipientAddress, amountWei);
    const receipt = await tx.wait();

    // 4. Record transaction in DB
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

    return {
      txHash: receipt.hash,
      status: receipt.status === 1 ? "success" : "failed",
    };
  }
}

// Helper functions (in production, use proper encryption)
function encryptPrivateKey(privateKey) {
  return privateKey; // Replace with actual encryption
}

function decryptPrivateKey(encryptedKey) {
  return encryptedKey; // Replace with actual decryption
}

module.exports = new WalletController();
