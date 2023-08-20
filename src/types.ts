import { IUser } from './models/userModel';
import { Request } from 'express';

export interface UserRequest extends Request {
  user?: IUser;
}
