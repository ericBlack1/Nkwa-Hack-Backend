const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const authMiddleware = require("../utils/auth");

/**
 * @swagger
 * components:
 *   schemas:
 *     BuyTokensRequest:
 *       type: object
 *       required:
 *         - amountXAF
 *         - phoneNumber
 *       properties:
 *         amountXAF:
 *           type: number
 *           description: Amount in Central African CFA francs
 *           example: 5000
 *         phoneNumber:
 *           type: string
 *           description: Mobile money phone number
 *           example: "+237612345678"
 *     PaymentResponse:
 *       type: object
 *       properties:
 *         paymentId:
 *           type: string
 *         afcAmount:
 *           type: number
 *         status:
 *           type: string
 *           enum: [pending, completed, failed]
 */

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Fiat to crypto payment processing
 */

/**
 * @swagger
 * /api/payments/buy:
 *   post:
 *     summary: Buy AFC tokens with XAF via NkwaPay
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BuyTokensRequest'
 *     responses:
 *       200:
 *         description: Payment initiated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentResponse'
 *       400:
 *         description: Bad request (invalid amount or phone number)
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/buy", authMiddleware, paymentController.buyTokens);

module.exports = router;
