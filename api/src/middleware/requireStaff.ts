import { Request, Response, NextFunction } from 'express';
import { Role } from '../models';
import httpStatus from 'http-status';

const requireStaff = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;

  const ALLOWED_USERS = [Role.ADMIN, Role.COMPANY_MANAGER, Role.EMPLOYEE];

  if (!user) {
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }

  if (!ALLOWED_USERS.includes(user.role)) {
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }

  return next();
};

export default requireStaff;
