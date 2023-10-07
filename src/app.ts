import 'reflect-metadata';
import './helpers/set-bsc-scan-tokens.helper'; // sets api url and api key tokens on the typedi container
import express, { Request, Response } from 'express';
import connectDB from './database/connection';
import authRoutes from './routes/auth.routes';

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

export default app;
