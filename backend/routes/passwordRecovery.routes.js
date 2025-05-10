const router = require('express').Router();
const passwordRecoveryController = require('../controllers/passwordRecovery.controller');

/**
 * @swagger
 * tags:
 *   name: Password Recovery
 *   description: Password reset functionality
 */

/**
 * @swagger
 * /api/password/request-reset:
 *   post:
 *     summary: Request password reset (sends email)
 *     tags: [Password Recovery]
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
 *     responses:
 *       200:
 *         description: Reset link sent to email
 *       404:
 *         description: User not found
 */
router.post('/request-reset', passwordRecoveryController.requestReset);

/**
 * @swagger
 * /api/password/verify-token:
 *   post:
 *     summary: Verify reset token
 *     tags: [Password Recovery]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token is valid
 *       400:
 *         description: Invalid or expired token
 */
router.post('/verify-token', passwordRecoveryController.verifyToken);

/**
 * @swagger
 * /api/password/reset:
 *   post:
 *     summary: Reset password after verification
 *     tags: [Password Recovery]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid token or weak password
 */
router.post('/reset', passwordRecoveryController.resetPassword);

module.exports = router;