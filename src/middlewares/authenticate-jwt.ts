import { Request, Response, NextFunction } from 'express';
import CustomError from '../errors/custom-error';
import passport from 'passport';
import { UserDocument } from '../models/user';

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    'jwt',
    { session: false },
    (err: NativeError, user: UserDocument, info: { message: string }) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(new CustomError(400, info?.message));
      }
      req.user = user;
      return next();
    }
  )(req, res, next);
};
