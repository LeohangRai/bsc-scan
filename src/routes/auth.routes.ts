import express from 'express';
import Container from 'typedi';
import { AuthController } from '../auth/auth.controller';
import wrapNext from '../middlewares/wrap-next';
const router = express.Router();

const authController = Container.get(AuthController);
router.post('/register', wrapNext(authController.register));

export default router;
