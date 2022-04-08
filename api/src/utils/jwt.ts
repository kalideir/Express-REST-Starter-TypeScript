import jwt from 'jsonwebtoken';
import config from 'config';
import { SECRET_KEYS } from '../@types';

export function signJwt(object: object, keyName: SECRET_KEYS, options?: jwt.SignOptions | undefined) {
  const signingKey = config.get<SECRET_KEYS>(keyName);
  return jwt.sign(object, 'publicKey', {
    ...(options && options),
    // algorithm: 'RS256',
  });
}

export function verifyJwt<T>(token: string, keyName: SECRET_KEYS): T | null {
  const publicKey = config.get<SECRET_KEYS>(keyName);
  try {
    const decoded = jwt.verify(token, 'publicKey') as T;
    return decoded;
  } catch (e) {
    return null;
  }
}
