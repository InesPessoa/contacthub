import { IUser, IUserModel } from '../models/userModel';
import { Request } from 'express';

export interface UserRequest extends Request {
  user?: IUserModel; // Does this makes sence?
}

export class AppError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
