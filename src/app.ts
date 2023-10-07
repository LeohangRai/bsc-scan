import 'reflect-metadata';
import './helpers/set-bsc-scan-tokens.helper'; // sets api url and api key tokens on the typedi container
import express, { NextFunction, Request, Response } from 'express';
import connectDB from './database/connection';
import authRoutes from './routes/auth.routes';
import globalErrorHandler from './middlewares/global-error-handler';
import CustomError from './errors/custom-error';

connectDB();
const app = express();

app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.send({
    status: 200,
    message: 'Hello world!'
  });
});

app.use('/auth', authRoutes);

/* unhandled routes */
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(
    new CustomError(
      404,
      `Route ${req.method.toUpperCase()} ${req.originalUrl} not found!`
    )
  );
});

/* global error handler */
app.use(globalErrorHandler);

export default app;
