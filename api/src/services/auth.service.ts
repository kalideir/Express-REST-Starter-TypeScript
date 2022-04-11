import { signJwt } from '../utils/jwt';
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

export async function signRefreshToken({ id, email }: RefreshTokenJWTPayload) {
  const refreshToken = signJwt(
    {
      id,
      email,
    },
    {
      expiresIn: '1y',
    },
  );

  return refreshToken;
}

export function signAccessToken(payload: AccessTokenJWTPayload) {
  const accessToken = signJwt(payload, {
    expiresIn: '1h',
  });

  return accessToken;
}

export function generatePasswordResetCode(email: string) {
  const passwordResetCode = signJwt(
    { email },
    {
      expiresIn: '90d',
    },
  );

  return passwordResetCode;
}

export function generateVerificationCode(email: string) {
  const verificationCode = signJwt(
    { email },
    {
      expiresIn: '90d',
    },
  );

  return verificationCode;
}

export async function reIssueAccessToken({ refreshToken }: { refreshToken: string }) {
  const decoded = verifyJwt(refreshToken) as RefreshTokenJWTPayload;

  if (!decoded || !decoded.id) return false;

  const user = await findUserById(decoded.id);

  if (!user) return false;

  const accessToken = signAccessToken({ id: user.id, email: user.email });

  return accessToken;
}
