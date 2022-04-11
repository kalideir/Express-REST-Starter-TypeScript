import { Strategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import { Role, UserDocument } from '../models';
import { Application } from 'express';
import config from 'config';
import { findUser } from '../services';

const jwtOptions = {
  secretOrKey: config.get<string>('jwtSecret'),
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
};

const jwt = async (payload, done) => {
  console.log(payload);
  try {
    const user = await findUser({ _id: payload.sub, role: Role.USER });
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
};

const staffJwt = async (payload, done) => {
  console.log(payload);
  try {
    const user = await findUser({ _id: payload.sub, role: Role.STAFF });
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
};

const adminJwt = async (payload, done) => {
  console.log(payload);
  try {
    const user = await findUser({ _id: payload.sub, role: Role.ADMIN });
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
};

export enum JwtTypes {
  Jwt = 'jwt',
  JwtTypes = 'staffJwt',
  AdminJwt = 'adminJwt',
}

export default function (app: Application) {
  passport.use(JwtTypes.Jwt, new Strategy(jwtOptions, jwt));
  passport.use(JwtTypes.JwtTypes, new Strategy(jwtOptions, staffJwt));
  passport.use(JwtTypes.AdminJwt, new Strategy(jwtOptions, adminJwt));
  passport.serializeUser((user: Partial<UserDocument>, done) => {
    delete user.password;
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
  app.use(passport.initialize());
}
