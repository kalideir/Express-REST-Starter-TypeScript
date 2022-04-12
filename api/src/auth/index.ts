import { Strategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import { Role, UserDocument } from '../models';
import { Application } from 'express';
import config from 'config';
import { findUser } from '../services';
import { t } from '../utils';
import { Strategy as GoogleStrategy, StrategyOptionsWithRequest } from 'passport-google-oauth2';

const googleClientId = config.get<string>('googleClientId');
const googleGoogleSecret = config.get<string>('googleGoogleSecret');
const googleCallbackURL = config.get<string>('googleCallbackURL');

const cookieExtractor = function (req) {
  let token = null;
  if (req && req.signedCookies && req.signedCookies.jwt) {
    token = req.signedCookies['jwt']['token'];
  }
  return token;
};

const jwtOptions = {
  secretOrKey: config.get<string>('jwtSecret'),
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
};

const googleOptions: StrategyOptionsWithRequest = {
  clientID: googleClientId,
  clientSecret: googleGoogleSecret,
  callbackURL: googleCallbackURL,
  passReqToCallback: true,
};

const jwtHandler = (role: Role) => async (payload, done) => {
  console.log({ payload });
  try {
    const user = await findUser({ _id: payload.sub, role });
    if (!user) {
      return done(null, false, { message: t('account_not_found') });
    }
    return done(null, user);
  } catch (error) {
    return done(error, false, { message: t('something_went_wrong') });
  }
};

const googleOauthHandler = async (request, accessToken, refreshToken, profile, done) => {
  try {
    const user = await findUser({ email: profile.email });
    if (!user) {
      return done(null, false, { message: t('account_not_found') });
    }
    return done(null, user);
  } catch (error) {
    return done(error, false, { message: t('something_went_wrong') });
  }
};

export enum StrategyTypes {
  Jwt = 'jwt',
  StaffJwt = 'staffJwt',
  AdminJwt = 'adminJwt',
  GoogleOauth = 'googleOauth',
}

export default function (app: Application) {
  passport.use(StrategyTypes.Jwt, new Strategy(jwtOptions, jwtHandler(Role.USER)));
  passport.use(StrategyTypes.StaffJwt, new Strategy(jwtOptions, jwtHandler(Role.STAFF)));
  passport.use(StrategyTypes.AdminJwt, new Strategy(jwtOptions, jwtHandler(Role.ADMIN)));
  passport.use(StrategyTypes.GoogleOauth, new GoogleStrategy(googleOptions, googleOauthHandler));

  passport.serializeUser((user: Partial<UserDocument>, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    done(null, id);
  });

  app.use(passport.initialize());
}
