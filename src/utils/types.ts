import { Schema } from 'mongoose';
import { Request } from 'express';
import { IUser } from '../models/userModel';

export interface UserRequest extends Request {
  user?: IUser; // Does this makes sence?
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
