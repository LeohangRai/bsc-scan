import passport from 'passport';
import { Strategy as LocalStrategy, IStrategyOptions } from 'passport-local';
import {
  ExtractJwt,
  Strategy as JWTStrategy,
  StrategyOptions as JWTStrategyOptions
} from 'passport-jwt';
import { User, UserDocument } from '../models/user';
import { SERVER_CONFIGS } from '.';
import { UserDataForAuthStrategy } from '../interfaces/user-data-for-auth-strategy.interface';

const localStrategyOpts: IStrategyOptions = {
  usernameField: 'username',
  passwordField: 'password'
};

passport.use(
  new LocalStrategy(localStrategyOpts, (username, password, done) => {
    User.findOneForLogin({ username })
      .then((user: UserDataForAuthStrategy | null) => {
        if (!user?.isPasswordValid(password)) {
          return done(null, false, {
            message: `Invalid username/password`
          });
        }
        return done(null, user);
      })
      .catch((err: NativeError) => {
        return done(err);
      });
  })
);

const jwtStrategyOptions: JWTStrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SERVER_CONFIGS.JWT_SECRET
};

passport.use(
  new JWTStrategy(jwtStrategyOptions, (jwtPayload, done) => {
    User.findOne({ _id: jwtPayload._id })
      .then((user: UserDocument | null) => {
        if (!user) {
          return done(null, false, {
            message: 'Invalid token'
          });
        }
        return done(null, user, jwtPayload);
      })
      .catch((err: NativeError) => {
        return done(err);
      });
  })
);
