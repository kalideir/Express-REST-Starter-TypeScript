import { Request, Response, NextFunction } from 'express';
import { Role } from '../models';
import httpStatus from 'http-status';

const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;
  if (!user) {
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }

  if (user.role !== Role.ADMIN) {
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }

  return next();
};

export default requireAdmin;
