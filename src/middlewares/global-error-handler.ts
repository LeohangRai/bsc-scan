import { NextFunction, Request, Response } from 'express';
import CustomError from '../errors/custom-error';

export default function (
  error: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  res.status(error.statusCode || 500).json({
    status: error.status || 'error',
    message: error.message
  });
}
