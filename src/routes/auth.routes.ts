import express from 'express';
import Container from 'typedi';
import { AuthController } from '../auth/auth.controller';
const router = express.Router();

const authController = Container.get(AuthController);
router.post('/register', authController.register);

export default router;
