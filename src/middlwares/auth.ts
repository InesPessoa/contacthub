import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import process from 'process';
import { Response } from 'express';
import { User } from '../models/userModel';
import { AppError, UserRequest } from '../utils/types';
import { catchAsync } from '../utils/catchAsync';
import { HttpStatusCode } from '../enums/httpStatusCode';

export const protect = catchAsync(
  async (req: UserRequest, res: Response, next: any) => {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      const token = req.headers.authorization.split(' ')[1];
      let decoded;
      try {
        // Decode the token
        decoded = jwt.verify(
          token as unknown as string,
          process.env.JWT_SECRET as Secret
        ) as JwtPayload; //Todo handle with jwt expired
      } catch (error) {
        return next(
          new AppError(
            'Error decoding the token: ' + (error as Error).message,
            HttpStatusCode.UNOUTHORIZED
          )
        );
      }
      // Check if user still exists
      req.user = (await User.findById(decoded.id))?.toJSON();
      if (!req.user) {
        new AppError(
          'The user belonging to this token does no longer exist!',
          HttpStatusCode.UNOUTHORIZED
        );
      }
      next();
    } else {
      next(
        new AppError(
          'You are not logged in! Please log in to get a token!',
          HttpStatusCode.UNOUTHORIZED
        )
      );
    }
  }
);