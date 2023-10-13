import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import Container from 'typedi';
import { AuthController } from '../auth/auth.controller';
import { validate } from '../middlewares/validate';
import {
  loginSchema,
  registerUserSchema,
  updateProfileSchema
} from '../auth/schemas/auth.schema';
import { UserDocument } from '../models/user';
import CustomError from '../errors/custom-error';
import wrapNext from '../middlewares/wrap-next';
import { authenticateJWT } from '../middlewares/authenticate-jwt';

const router = express.Router();

const authController = Container.get(AuthController);

/**
 * @openapi
 *   /auth/register:
 *     post:
 *       tags: ['auth']
 *       summary: Register a user
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterUserInput'
 *       responses:
 *         200:
 *           description: Success
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/RegisterUserResponse'
 */
router.post(
  '/register',
  validate(registerUserSchema),
  wrapNext(authController.register)
);

/**
 * @openapi
 *   /auth/login:
 *     post:
 *       tags: ['auth']
 *       summary: User login
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginInput'
 *       responses:
 *         200:
 *           description: Success
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/LoginResponse'
 */
router.post(
  '/login',
  validate(loginSchema),
  (_req: Request, res: Response, next: NextFunction) => {
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
  }
);

router.use(authenticateJWT);

/**
 * @openapi
 *   /auth/profile:
 *     get:
 *       tags: ['auth']
 *       summary: Get profile
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Success
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ProfileResponse'
 */
router.get('/profile', wrapNext(authController.getProfile));

/**
 * @openapi
 *   /auth/profile:
 *     patch:
 *       tags: ['auth']
 *       summary: Update profile
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateProfileInput'
 *       responses:
 *         '200':
 *           description: Success
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ProfileResponse'
 */
router.patch(
  '/profile',
  validate(updateProfileSchema),
  wrapNext(authController.updateProfile)
);

export default router;
