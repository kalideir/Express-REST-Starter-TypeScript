import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { UserModel } from '../models';
import {
  RegisterUserInput,
  ForgotPasswordInput,
  LoginInput,
  NewTokenInput,
  ResendVerificationCodeInput,
  ResetPasswordInput,
  VerifyUserInput,
  NewPasswordInput,
} from '../schema';
import {
  registerUser,
  findUser,
  findUserByEmail,
  generatePasswordResetCode,
  generateVerificationCode,
  reIssueAccessToken,
  signAccessToken,
  signRefreshToken,
} from '../services';
import { logger, t } from '../utils';

export async function register(req: Request<RegisterUserInput>, res: Response) {
  try {
    const user = await registerUser(req.body);
    const verificationCode = await generateVerificationCode(user.email);
    user.verificationCode = verificationCode;
    await user.save();
    res.json({ message: t('account_create_success') });
  } catch (e) {
    logger.error(e);
    return res.status(httpStatus.CONFLICT).send({ message: t('account_already_exists') });
  }
}

export async function login(req: Request<LoginInput>, res: Response) {
  try {
    const { email, password } = req.body;

    let user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).send({ message: t('user_not_found') });
    }

    const isValid = await user.comparePassword(password);

    if (!isValid) {
      return res.status(httpStatus.UNAUTHORIZED).send({ message: t('login_invalid') });
    }

    if (!user.verified) {
      return res.status(httpStatus.FORBIDDEN).send({ message: t('account_not_verified') });
    }

    if (!user.active) {
      return res.status(httpStatus.UNAUTHORIZED).send({ message: t('login_invalid') });
    }

    const accessToken = signAccessToken({ id: user.id, email: user.email });

    const refreshToken = await signRefreshToken({ id: user._id, email: user.email });

    user = await user.populate('profilePicture');

    return res.send({
      accessToken,
      refreshToken,
      user: user.toJSON(),
      message: t('login_success'),
    });
  } catch (e) {
    logger.error(e);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: e.message });
  }
}

export async function verifyUser(req: Request<VerifyUserInput>, res: Response) {
  const { verificationCode } = req.query;

  const user = await findUser({ verificationCode });

  if (!user) {
    return res.status(httpStatus.NOT_FOUND);
  }

  if (user.verified) {
    return res.status(httpStatus.FORBIDDEN).send({ message: t('account_not_verified') });
  }

  user.verified = true;
  user.verificationCode = null;
  await user.save();

  const accessToken = signAccessToken({ id: user.id, email: user.email });

  const refreshToken = await signRefreshToken({ id: user._id, email: user.email });

  return res.send({
    accessToken,
    refreshToken,
    user: user.toJSON(),
    message: t('verification_success'),
  });
}

export async function resendVerificationCode(req: Request<ResendVerificationCodeInput>, res: Response) {
  const { email } = req.body;

  const user = await findUserByEmail(email);

  if (!user) {
    logger.debug(`User with email ${email} does not exists`);
    return res.send({ message: t('account_not_found') });
  }

  if (user.verified) {
    return res.status(httpStatus.FORBIDDEN).send({ message: t('account_already_verified') });
  }

  const verificationCode = await generateVerificationCode(user.email);

  user.verificationCode = verificationCode;

  await user.save();

  logger.debug(`Verification code was resent to ${email}`);

  return res.send({ message: t('verification_code_was_sent') });
}

export async function forgotPassword(req: Request<ForgotPasswordInput>, res: Response) {
  const { email } = req.body;

  const user = await findUserByEmail(email);

  if (!user) {
    return res.send({ message: t('account_not_found') });
  }

  if (!user.verified) {
    return res.status(httpStatus.FORBIDDEN).send({ message: t('account_not_verified') });
  }

  const passwordResetCode = await generatePasswordResetCode(user.email);

  user.passwordResetCode = passwordResetCode;

  await user.save();

  logger.debug(`Reset password link was sent to ${email}`);

  return res.send({ message: t('reset_password_link_sent') });
}

export async function resetPassword(req: Request<ResetPasswordInput>, res: Response) {
  const { passwordResetCode } = req.query as { passwordResetCode: string };

  const { password } = req.body;

  const user = await findUser({ passwordResetCode });

  if (!user || !user.passwordResetCode || user.passwordResetCode !== passwordResetCode) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: t('not_allowed') });
  }

  user.passwordResetCode = null;

  user.password = password;

  await user.save();

  return res.send({ message: t('password_reset_success') });
}

export async function newPassword(req: Request<NewPasswordInput>, res: Response) {
  const { password } = req.body;

  const user = res.locals.user;

  user.password = password;

  await user.save();

  return res.send({ message: t('password_reset_success') });
}

export async function getCurrentUser(req: Request, res: Response) {
  let user = res.locals.user;
  user = await user.populate('profilePicture');
  return res.send({ ...user.toJSON() });
}

export async function token(req: Request<unknown, unknown, NewTokenInput>, res: Response) {
  const { refreshToken } = req.body;
  const newAccessToken = await reIssueAccessToken({ refreshToken });
  if (newAccessToken) {
    return res.send({ token: newAccessToken });
  }
  return res.status(httpStatus.FORBIDDEN).send({ message: t('not_allowed') });
}
