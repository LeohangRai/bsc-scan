import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import Container from 'typedi';
import { AuthController } from '../auth/auth.controller';
import { validate } from '../middlewares/validate';
import { registerUserSchema } from '../auth/schemas/auth.schema';
import { UserDocument } from '../models/user';
import CustomError from '../errors/custom-error';
import wrapNext from '../middlewares/wrap-next';

const router = express.Router();

const authController = Container.get(AuthController);
router.post(
  '/register',
  wrapNext(validate(registerUserSchema)),
  wrapNext(authController.register)
);

router.post('/login', (_req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    'local',
    { session: false },
    (err: NativeError, user: UserDocument, info: { message: string }) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(new CustomError(400, info?.message));
      }
      return res.json(user);
    }
  )(_req, res, next);
});

export default router;
