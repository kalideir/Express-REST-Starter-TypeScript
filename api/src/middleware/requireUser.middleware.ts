import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';

const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;

  if (!user) {
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }

  return next();
};

export default requireUser;
