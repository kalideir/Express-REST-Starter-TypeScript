import { number, object, string, TypeOf } from 'zod';

/**
 * @swagger
 * components:
 *  schemas:
 *    RegisterUserInput:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          default: 'decoder314@gmail.com'
 *        password:
 *          type: string
 *          default: stringPassword123
 *    RegisterUserResponse:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *        _id:
 *          type: string
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 */
export const registerUserSchema = object({
  body: object({
    password: string({
      required_error: 'lösenord krävs',
    }).min(6, 'Lösenordet är för kort - bör vara minst 6 teckens'),
    email: string({
      required_error: 'E-post krävs',
    }).email('Inte ett giltigt mejl'),
  }),
});

/**
 * @swagger
 * components:
 *  schemas:
 *    LoginInput:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          default: 'ali.dulaimi.h@gmail.com'
 *        password:
 *          type: string
 *          default: aqaqaq
 *    LoginResponse:
 *        type: object
 *        properties:
 *          accessToken:
 *            type: string
 *          refreshToken:
 *            type: string
 *          _id:
 *            type: string
 *          createdAt:
 *            type: string
 *          updatedAt:
 *            type: string
 */
export const loginSchema = object({
  body: object({
    email: string({
      required_error: 'E-post krävs',
    }).email('Ogiltig e-post eller lösenord'),
    password: string({
      required_error: 'lösenord krävs',
    }).min(6, 'Ogiltig e-post eller lösenord'),
  }),
});

/**
 * @swagger
 * components:
 *  schemas:
 *      VerifyUserResponse:
 *        type: object
 *        properties:
 *          email:
 *            type: string
 *          fullName:
 *            type: string
 *          _id:
 *            type: string
 *          createdAt:
 *            type: string
 *          updatedAt:
 *            type: string
 */
export const verifyUserSchema = object({
  query: object({
    verificationCode: string(),
  }),
});

/**
 * @swagger
 * components:
 *  schemas:
 *    ResendVerificationCodeInput:
 *      type: object
 *      required:
 *        - email
 *      properties:
 *        email:
 *          type: string
 *    ResendVerificationCodeResponse:
 *        type: object
 *        properties:
 *          email:
 *            type: string
 *          fullName:
 *            type: string
 *          _id:
 *            type: string
 *          createdAt:
 *            type: string
 *          updatedAt:
 *            type: string
 */
export const resendVerificationCodeSchema = object({
  body: object({
    email: string({
      required_error: 'E-post krävs',
    }).email('Inte ett giltigt mejl'),
  }),
});

/**
 * @swagger
 * components:
 *  schemas:
 *    ForgotPasswordInput:
 *      type: object
 *      required:
 *        - email
 *      properties:
 *        email:
 *          type: string
 *    ForgotPasswordResponse:
 *        type: object
 *        properties:
 *          email:
 *            type: string
 *          fullName:
 *            type: string
 *          _id:
 *            type: string
 *          createdAt:
 *            type: string
 *          updatedAt:
 *            type: string
 */
export const forgotPasswordSchema = object({
  body: object({
    email: string({
      required_error: 'E-post krävs',
    }).email('Inte ett giltigt mejl'),
  }),
});

/**
 * @swagger
 * components:
 *  schemas:
 *    ResetPasswordInput:
 *      type: object
 *      required:
 *        - password
 *        - passwordConfirmation
 *      properties:
 *        password:
 *          type: string
 *        passwordConfirmation:
 *          type: string
 *    ResetPasswordResponse:
 *        type: object
 *        properties:
 *          email:
 *            type: string
 *          fullName:
 *            type: string
 *          _id:
 *            type: string
 *          createdAt:
 *            type: string
 *          updatedAt:
 *            type: string
 */
export const resetPasswordSchema = object({
  query: object({
    passwordResetCode: string(),
  }),
  body: object({
    password: string({
      required_error: 'lösenord krävs',
    }).min(6, 'Lösenordet är för kort - bör vara minst 6 tecken'),
    passwordConfirmation: string({
      required_error: 'Lösenordsbekräftelse krävs',
    }),
  }).refine(data => data.password === data.passwordConfirmation, {
    message: 'Lösenorden matchar inte',
    path: ['passwordConfirmation'],
  }),
});

/**
 * @swagger
 * components:
 *  schemas:
 *    NewPasswordInput:
 *      type: object
 *      required:
 *        - password
 *        - passwordConfirmation
 *      properties:
 *        password:
 *          type: string
 *        passwordConfirmation:
 *          type: string
 *    NewPasswordResponse:
 *        type: object
 *        properties:
 *          email:
 *            type: string
 *          fullName:
 *            type: string
 *          _id:
 *            type: string
 *          createdAt:
 *            type: string
 *          updatedAt:
 *            type: string
 */
export const newPasswordSchema = object({
  body: object({
    password: string({
      required_error: 'lösenord krävs',
    }).min(6, 'Lösenordet är för kort - bör vara minst 6 tecken'),
    passwordConfirmation: string({
      required_error: 'Lösenordsbekräftelse krävs',
    }),
  }).refine(data => data.password === data.passwordConfirmation, {
    message: 'Lösenorden matchar inte',
    path: ['passwordConfirmation'],
  }),
});

/**
 * @swagger
 * components:
 *  schemas:
 *    NewTokenInput:
 *      type: object
 *      required:
 *        - refreshToken
 *      properties:
 *        refreshToken:
 *          type: string
 *    NewTokenResponse:
 *        type: object
 *        properties:
 *          token:
 *            type: string
 */
export const tokenSchema = object({
  body: object({
    refreshToken: string({ required_error: 'RefreshToken is required to generate new AccessToken' }),
  }),
});

export type RegisterUserInput = TypeOf<typeof registerUserSchema>['body'];

export type VerifyUserInput = TypeOf<typeof verifyUserSchema>['query'];

export type ResendVerificationCodeInput = TypeOf<typeof resendVerificationCodeSchema>['body'];

export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>['body'];

export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;

export type NewPasswordInput = TypeOf<typeof newPasswordSchema>;

export type LoginInput = TypeOf<typeof loginSchema>['body'];

export type NewTokenInput = TypeOf<typeof tokenSchema>['body'];
