import express, { Request, Response } from 'express';
import connectDB from './database/connection';

connectDB();
const app = express();

app.get('/', (_req: Request, res: Response) => {
  res.send({
    status: 200,
    message: 'Hello world!'
  });
});

export default app;
