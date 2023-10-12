import 'reflect-metadata';
import './helpers/set-bsc-scan-tokens.helper'; // sets api url and api key tokens on the typedi container
import express, { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import './configs/passport';
import connectDB from './database/connection';
import authRoutes from './routes/auth.routes';
import walletRoutes from './routes/wallet.routes';
import globalErrorHandler from './middlewares/global-error-handler';
import CustomError from './errors/custom-error';
import swaggerDocs from './configs/swagger';

connectDB();
const app = express();

app.use(express.json());
app.use(passport.initialize());

/**
 * @openapi
 * /:
 *   get:
 *     tags:
 *       - health-check
 *     description: Responds with a Hello World message
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   default: success
 *                 message:
 *                   type: string
 *                   default: 'Hello world!'
 */
app.get('/', (_req: Request, res: Response) => {
  res.send({
    status: 'success',
    message: 'Hello world!'
  });
});

/**
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - health-check
 *     description: Responds with status 200 if the app is up and running
 *     responses:
 *       200:
 *         description: App is up and running
 */
app.get('/health', (_req: Request, res: Response) => {
  res.sendStatus(200);
});

app.use('/auth', authRoutes);
app.use('/wallets', walletRoutes);
swaggerDocs(app);

/* unhandled routes */
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(
    new CustomError(
      404,
      `Route ${req.method.toUpperCase()} ${req.originalUrl} not found!`
    )
  );
});

/* Global error-handler */
app.use(globalErrorHandler);

export default app;
