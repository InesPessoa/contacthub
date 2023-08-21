import { AppError } from '../utils/types';
import { Request, Response } from 'express';

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: any
) => {
  res.status(200).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
