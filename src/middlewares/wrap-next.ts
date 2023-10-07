import { NextFunction, Request, Response } from 'express';

type ExpressCallbackFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => any;

export default function (fn: ExpressCallbackFunction) {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
