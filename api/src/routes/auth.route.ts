import { Router } from 'express';
import * as controller from '../controllers/auth.controller';
import { deserializeUser, requireUser, validate } from '../middleware';
import {
  createUserSchema,
  forgotPasswordSchema,
  loginSchema,
  newPasswordSchema,
  registerUserSchema,
  resendVerificationCodeSchema,
  resetPasswordSchema,
  tokenSchema,
  verifyUserSchema,
} from '../schema';

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register new user
 *     security: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/RegisterUserInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/RegisterUserResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
router.post('/register', validate(registerUserSchema), controller.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login user
 *     security: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/LoginInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/LoginResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
router.post('/login', validate(loginSchema), controller.login);

/**
 * @swagger
 * /auth/verifyUser:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Verify user
 *     security: []
 *     parameters:
 *       - name: verificationCode
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/VerifyUserResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
router.post('/verifyUser', validate(verifyUserSchema), controller.verifyUser);

/**
 * @swagger
 * /auth/resendVerificationCode:
 *   post:
 *     tags:
 *       - Auth
 *     name: Forgot Password
 *     summary: Forgot password
 *     security: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/ResendVerificationCodeInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResendVerificationCodeResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
router.post('/resendVerificationCode', validate(resendVerificationCodeSchema), controller.resendVerificationCode);

/**
 * @swagger
 * /auth/forgotPassword:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Forgot password
 *     security: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/ForgotPasswordInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ForgotPasswordResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
router.post('/forgotPassword', validate(forgotPasswordSchema), controller.forgotPassword);

/**
 * @swagger
 * /auth/resetPassword:
 *   post:
 *     tags:
 *       - Auth
 *     name: Forgot Password
 *     summary: Forgot password
 *     security: []
 *     parameters:
 *      - name: passwordResetCode
 *        in: query
 *        required: true
 *        schema:
 *          type: string
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/ResetPasswordInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResetPasswordResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
router.post('/resetPassword', validate(resetPasswordSchema), controller.resetPassword);

/**
 * @swagger
 * /auth/newPassword:
 *   post:
 *     tags:
 *       - Auth
 *     name: Forgot Password
 *     summary: Forgot password
 *     security:
 *       - Bearer: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/NewPasswordInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/NewPasswordResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
router.post('/newPassword', requireUser, validate(newPasswordSchema), controller.newPassword);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get user by access token
 *     security:
 *       - Bearer: []
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GetUserResponse'
 */
router.get('/me', requireUser, controller.getCurrentUser);

/**
 * @swagger
 * /auth/token:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Regenerate token
 *     security: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/NewTokenInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/NewTokenResponse'
 */
router.post('/token', validate(tokenSchema), controller.token);

export default router;
