import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { JwtTypes } from '../auth';
import { ApiError } from '../errors';
import { t } from '../utils';

const handleJWT = (req, res, next) => async (err, user, info) => {
  const error = err || info;
  if (err) {
    return next(ApiError.internalServerError(error.message || t('something_went_wrong')));
  }
  if (!user) {
    return next(ApiError.unauthorized(t('unauthorized')));
  }
  if (!user.active) {
    return next(ApiError.unauthorized(t('unauthorized')));
  }
  if (!user.verified) {
    return next(ApiError.unauthorized(t('account_not_verified')));
  }
  req.user = user;
  return next();
};

export const authorizeUser = (req: Request, res: Response, next: NextFunction) =>
  passport.authenticate(JwtTypes.Jwt, { session: false }, handleJWT(req, res, next))(req, res, next);

export const authorizeStaff = (req: Request, res: Response, next: NextFunction) =>
  passport.authenticate(JwtTypes.StaffJwt, { session: false }, handleJWT(req, res, next))(req, res, next);

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) =>
  passport.authenticate(JwtTypes.AdminJwt, { session: false }, handleJWT(req, res, next))(req, res, next);
