import httpStatus from 'http-status';
import passport from 'passport';
import { ApiError } from '../errors';

const handleJWT = (req, res, next) => async (err, user, info) => {
  const error = err || info;
  console.log(user, info, err);
  try {
    if (error || !user) throw error;
  } catch (e) {
    return next(e);
  }
  if (err || !user) {
    return next();
  }
  if (user.blocked) {
    return next();
  }

  req.user = user;
  return next();
};

export const authorize = (req, res, next) => passport.authenticate('jwt', { session: false }, handleJWT(req, res, next))(req, res, next);

export const oAuth = service => passport.authenticate(service, { session: false });
