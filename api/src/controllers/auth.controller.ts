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
import { logger, sendEmail } from '../utils';
import { sendEmailProducer } from '../workers';

import config from 'config';

const baseUrl = config.get<string>('baseUrl');
const clientUrl = config.get<string>('clientUrl');

export async function register(req: Request<unknown, unknown, RegisterUserInput>, res: Response) {
  try {
    const user = await registerUser(req.body);
    const verificationCode = await generateVerificationCode(user.email);
    user.verificationCode = verificationCode;
    await user.save();
    const emailOptions = {
      to: user.email,
      subject: 'Ditt konto har skapats framgångsrikt. Vänligen verifiera din e-postadress.',
    };
    const context = {
      description: 'För att kunna logga in vänligen verifiera din e-post via denna länk:',
      subject: 'Ditt konto har skapats framgångsrikt. Vänligen verifiera din e-postadress.',
      action: 'Aktivera konto',
      actionUrl: `${clientUrl}/verify-account/${user.verificationCode}`,
      message: 'Välkommen till Ahlan Jobb',
      btnText: 'Aktivera konto',
    };
    sendEmail(emailOptions, context);
    // sendEmailProducer(emailOptions, context);
    res.json({ message: 'Kontot har skapats. Kontrollera din inkorg för att verifiera din e-post' });
  } catch (e) {
    logger.error(e);
    return res.status(httpStatus.CONFLICT).send({ message: 'Kontot finns. Logga in istället.' });
  }
}

export async function login(req: Request<unknown, unknown, LoginInput>, res: Response) {
  try {
    const message = 'Ogiltig e-post eller lösenord';
    const { email, password } = req.body;

    let user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).send({ message });
    }

    const isValid = await user.comparePassword(password);

    if (!isValid) {
      return res.status(httpStatus.UNAUTHORIZED).send({ message });
    }

    if (!user.verified) {
      return res.status(httpStatus.UNAUTHORIZED).send({ message: 'Vänligen verifiera din e-post' });
    }

    if (user.disabled) {
      return res.status(httpStatus.UNAUTHORIZED).send({ message: 'Kontakta oss för mer information.' });
    }

    const accessToken = signAccessToken({ id: user.id, email: user.email });

    const refreshToken = await signRefreshToken({ id: user._id, email: user.email });

    user = await (await (await (await user.populate('company')).populate('employee')).populate('profilePicture')).populate('resume');

    return res.send({
      accessToken,
      refreshToken,
      user: user.toJSON(),
      message: 'Inloggad framgångsrikt',
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
    return res.status(httpStatus.FORBIDDEN).send({ message: 'Användaren har redan verifierats' });
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
    message: 'Användaren har verifierats',
  });
}

export async function resendVerificationCode(req: Request<unknown, unknown, ResendVerificationCodeInput>, res: Response) {
  const message = 'Om en användare med den e-postadressen är registrerad kommer du att få ett e-postmeddelande om lösenordsåterställning';

  const { email } = req.body;

  const user = await findUserByEmail(email);

  if (!user) {
    logger.debug(`User with email ${email} does not exists`);
    return res.send({ message });
  }

  if (user.verified) {
    return res.status(httpStatus.FORBIDDEN).send({ message: 'Den här användaren är redan verifierad' });
  }

  const verificationCode = await generateVerificationCode(user.email);

  user.verificationCode = verificationCode;

  await user.save();

  const emailOptions = {
    to: email,
    subject: 'Här är länken för att verifiera din e-post',
  };
  const context = {
    description: 'Klicka på länken nedan för att aktivera ditt konto.',
    subject: 'Verifieringslänk',
    action: 'Verifiera konto',
    actionUrl: `${clientUrl}/verify-account/${verificationCode}`,
    message: '',
    btnText: 'Verifiera konto',
  };

  sendEmail(emailOptions, context);
  // sendEmailProducer(emailOptions, context);

  logger.debug(`Kontoaktiveringse-post skickades till ${email}`);

  return res.send({ message });
}

export async function forgotPassword(req: Request<unknown, unknown, ForgotPasswordInput>, res: Response) {
  const message = 'Om en användare med den e-postadressen är registrerad kommer du att få ett e-postmeddelande om lösenordsåterställning';

  const { email } = req.body;

  const user = await findUserByEmail(email);

  if (!user) {
    logger.debug(`Användare med e-post ${email} existerar inte`);
    return res.send({ message });
  }

  if (!user.verified) {
    return res.status(httpStatus.FORBIDDEN).send({ message: 'Användaren är inte verifierad' });
  }

  const passwordResetCode = await generatePasswordResetCode(user.email);

  user.passwordResetCode = passwordResetCode;

  await user.save();

  const emailOptions = {
    to: email,
    subject: 'Här är länken för att ändra ditt lösenord',
  };
  const context = {
    description: 'Klicka på länken nedan för att ändra ditt lösenord.',
    subject: 'nytt lösenord',
    action: 'Skicka nytt lösenord',
    actionUrl: `${clientUrl}/reset-password/${passwordResetCode}`,
    message: '',
    btnText: 'nytt lösenord',
  };

  sendEmail(emailOptions, context);

  logger.debug(`E-postmeddelande om lösenordsåterställning har skickats till ${email}`);

  return res.send({ message });
}

export async function resetPassword(req: Request<ResetPasswordInput['query'], unknown, ResetPasswordInput['body']>, res: Response) {
  const { passwordResetCode } = req.query as { passwordResetCode: string };

  const { password } = req.body;

  const user = await findUser({ passwordResetCode });

  if (!user || !user.passwordResetCode || user.passwordResetCode !== passwordResetCode) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: 'Kunde inte återställa användarlösenordet' });
  }

  user.passwordResetCode = null;

  user.password = password;

  await user.save();

  return res.send({ message: 'Lösenordet har uppdaterats. Vänligen logga in.' });
}

export async function newPassword(req: Request<NewPasswordInput['body']>, res: Response) {
  const { password } = req.body;

  const user = res.locals.user;

  user.password = password;

  await user.save();

  return res.send({ message: 'Lösenordet har uppdaterats. Vänligen logga in.' });
}

export async function getCurrentUser(req: Request, res: Response) {
  let user = res.locals.user;
  user = await (await (await (await user.populate('company')).populate('employee')).populate('profilePicture')).populate('resume');
  return res.send({ ...user.toJSON() });
}

export async function token(req: Request<unknown, unknown, NewTokenInput>, res: Response) {
  const { refreshToken } = req.body;
  const newAccessToken = await reIssueAccessToken({ refreshToken });
  if (newAccessToken) {
    return res.send({ token: newAccessToken });
  }
  return res.status(httpStatus.FORBIDDEN).send({ message: 'Det gick inte att generera en ny åtkomsttoken. Försök att logga in.' });
}
