import passport from 'passport';
import { Strategy as LocalStrategy, IStrategyOptions } from 'passport-local';
import {
  ExtractJwt,
  Strategy as JWTStrategy,
  StrategyOptions as JWTStrategyOptions
} from 'passport-jwt';
import { User, UserDocument } from '../models/user';
import { SERVER_CONFIGS } from '.';

const localStrategyOpts: IStrategyOptions = {
  usernameField: 'username',
  passwordField: 'password'
};

passport.use(
  new LocalStrategy(localStrategyOpts, (username, password, done) => {
    User.findOne({ username })
      .then((user: UserDocument | null) => {
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
    User.findOne(
      {
        username: jwtPayload.username
      },
      (err: NativeError, user: UserDocument) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(undefined, user, jwtPayload);
        }
        return done(undefined, false, 'Invalid token');
      }
    );
  })
);
