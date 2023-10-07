import express from 'express';
import Container from 'typedi';
import { AuthController } from '../auth/auth.controller';
import wrapNext from '../middlewares/wrap-next';
import { validate } from '../middlewares/validate';
import { registerUserSchema } from '../auth/schemas/auth.schema';
const router = express.Router();

const authController = Container.get(AuthController);
router.post(
  '/register',
  wrapNext(validate(registerUserSchema)),
  wrapNext(authController.register)
);

export default router;
