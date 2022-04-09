import jwt from 'jsonwebtoken';
import config from 'config';
export type SECRET_KEY = string;

export function signJwt(object: object, keyName: SECRET_KEY, options?: jwt.SignOptions | undefined) {
  const signingKey = config.get<SECRET_KEY>(keyName);
  return jwt.sign(object, 'publicKey', {
    ...(options && options),
    // algorithm: 'RS256',
  });
}

export function verifyJwt<T>(token: string, keyName: SECRET_KEY): T | null {
  const publicKey = config.get<SECRET_KEY>(keyName);
  try {
    const decoded = jwt.verify(token, 'publicKey') as T;
    return decoded;
  } catch (e) {
    return null;
  }
}
