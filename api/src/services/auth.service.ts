import { signJwt } from '../utils/jwt';
import { findUserById } from '.';
import { verifyJwt } from '../utils';

export type AccessTokenJWTPayload = {
  sub: string;
};

export type RefreshTokenJWTPayload = {
  sub: string;
};

export async function signRefreshToken({ sub }: RefreshTokenJWTPayload) {
  const refreshToken = signJwt(
    {
      sub,
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
      expiresIn: '1h',
    },
  );

  return passwordResetCode;
}

export function generateVerificationCode(email: string) {
  const verificationCode = signJwt(
    { email },
    {
      expiresIn: '1d',
    },
  );

  return verificationCode;
}

export async function reIssueAccessToken({ refreshToken }: { refreshToken: string }) {
  const decoded = verifyJwt(refreshToken) as RefreshTokenJWTPayload;

  if (!decoded || !decoded.sub) return false;

  const user = await findUserById(decoded.sub);

  if (!user) return false;

  const accessToken = signAccessToken({ sub: user.id });

  return accessToken;
}
