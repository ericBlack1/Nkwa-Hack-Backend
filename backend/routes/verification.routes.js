// backend/routes/verification.routes.js
const router = require('express').Router();
const verificationController = require('../controllers/verification.controller');
const authenticate = require('../utils/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Verification
 *   description: Phone and email verification endpoints
 */

/**
 * @swagger
 * /api/verification/phone/send:
 *   post:
 *     summary: Send OTP to phone
 *     tags: [Verification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/phone/send', authenticate, verificationController.sendPhoneOTP);

/**
 * @swagger
 * /api/verification/phone/verify:
 *   post:
 *     summary: Verify phone OTP
 *     tags: [Verification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Phone verified successfully
 *       400:
 *         description: Invalid or expired OTP
 *       401:
 *         description: Unauthorized
 */
router.post('/phone/verify', authenticate, verificationController.verifyPhoneOTP);

/**
 * @swagger
 * /api/verification/email/send:
 *   post:
 *     summary: Send OTP to email
 *     tags: [Verification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/email/send', authenticate, verificationController.sendEmailOTP);

/**
 * @swagger
 * /api/verification/email/verify:
 *   post:
 *     summary: Verify email OTP
 *     tags: [Verification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired OTP
 *       401:
 *         description: Unauthorized
 */
router.post('/email/verify', authenticate, verificationController.verifyEmailOTP);

module.exports = router;
