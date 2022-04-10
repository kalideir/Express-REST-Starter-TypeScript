import { Request, Response, NextFunction } from 'express';
import { AccessTokenJWTPayload, findUserById } from '../services';
import { logger, verifyJwt } from '../utils';

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = (req.headers.authorization || '').replace(/^Bearer\s/, '');

  if (!accessToken) {
    return next();
  }

  const decoded: AccessTokenJWTPayload | null = verifyJwt(accessToken, 'secret');

  if (decoded) {
    const user = await findUserById(decoded.id);
    res.locals.user = user;
  }

  return next();
};

export default deserializeUser;
