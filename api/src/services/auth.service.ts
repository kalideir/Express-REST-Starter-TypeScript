import { signJwt } from '../utils/jwt';
import { UserDocument, UserModel } from '../models';
import { get } from 'lodash';
import { findUserById } from '.';
import { verifyJwt } from '../utils';

export type AccessTokenJWTPayload = {
  id: string;
  email: string;
};

export type RefreshTokenJWTPayload = {
  id: string;
  email: string;
};

export async function registerUser(input: Partial<UserDocument>) {
  try {
    const user = await UserModel.create(input);
    return user.save();
  } catch (e) {
    throw new Error(e);
  }
}

export async function signRefreshToken({ id, email }: RefreshTokenJWTPayload) {
  const refreshToken = signJwt(
    {
      id,
      email,
    },
    'secret',
    {
      expiresIn: '1y',
    },
  );

  return refreshToken;
}

export function signAccessToken(payload: AccessTokenJWTPayload) {
  const accessToken = signJwt(payload, 'secret', {
    expiresIn: '15h', // requires change
  });

  return accessToken;
}

export function generatePasswordResetCode(email: string) {
  const passwordResetCode = signJwt({ email }, 'secret', {
    expiresIn: '90d',
  });

  return passwordResetCode;
}

export function generateVerificationCode(email: string) {
  const verificationCode = signJwt({ email }, 'secret', {
    expiresIn: '90d',
  });

  return verificationCode;
}

export async function reIssueAccessToken({ refreshToken }: { refreshToken: string }) {
  const decoded = verifyJwt(refreshToken, 'secret') as RefreshTokenJWTPayload;

  console.log(decoded, refreshToken);

  if (!decoded || !get(decoded, 'id')) return false;

  const user = await findUserById(decoded.id);

  if (!user) return false;

  const accessToken = signAccessToken({ id: user.id, email: user.email });

  return accessToken;
}
