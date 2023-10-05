import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
const app = express();
const dbUrl = process.env.DB_URI ?? '';

mongoose.connect(dbUrl);
const database = mongoose.connection;
database.on('error', (error) => {
  console.log('error:', error);
});
database.once('connected', () => {
  console.log('Database connection successful!');
});

app.get('/', (_req: Request, res: Response) => {
  res.send({
    status: 200,
    message: 'Hello world!'
  });
});

export default app;
