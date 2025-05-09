const express = require("express");
const router = express.Router();
const walletController = require("../controllers/wallet.controller");
const authMiddleware = require("../utils/auth");

/**
 * @swagger
 * components:
 *   schemas:
 *     Wallet:
 *       type: object
 *       properties:
 *         address:
 *           type: string
 *           example: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
 *         privateKey:
 *           type: string
 *           example: "0x..."
 *     Balance:
 *       type: object
 *       properties:
 *         address:
 *           type: string
 *         blockchainBalance:
 *           type: string
 *           description: Balance in AFC from blockchain
 *           example: "100000000000000000000"
 *         internalBalance:
 *           type: number
 *           description: Balance in AFC from internal accounting
 *           example: 100.0
 *     TransferRequest:
 *       type: object
 *       required:
 *         - recipientAddress
 *         - amount
 *       properties:
 *         recipientAddress:
 *           type: string
 *           example: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B"
 *         amount:
 *           type: number
 *           example: 10.5
 *     Transaction:
 *       type: object
 *       properties:
 *         txHash:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, success, failed]
 */

/**
 * @swagger
 * tags:
 *   name: Wallet
 *   description: Digital wallet management
 */

/**
 * @swagger
 * /api/wallet:
 *   post:
 *     summary: Create a new wallet for authenticated user
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wallet'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/", authMiddleware, walletController.createWallet);

/**
 * @swagger
 * /api/wallet/balance:
 *   get:
 *     summary: Get wallet balance (blockchain + internal)
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet balance retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Balance'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Wallet not found
 *       500:
 *         description: Internal server error
 */
router.get("/balance", authMiddleware, walletController.getWalletBalance);

/**
 * @swagger
 * /api/wallet/transfer:
 *   post:
 *     summary: Transfer AFC tokens to another address
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransferRequest'
 *     responses:
 *       200:
 *         description: Transfer initiated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Bad request (insufficient balance, invalid address)
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/transfer", authMiddleware, walletController.transferTokens);

module.exports = router;
