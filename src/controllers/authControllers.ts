import { UUID } from 'crypto';
import jwt, { Jwt, JwtPayload, Secret } from 'jsonwebtoken';
import process from 'process';
import { CookieOptions, Request, Response } from 'express';
import { Contact } from '../models/contactModel';
import { IUser, User } from '../models/userModel';
import mongoose, { ClientSession } from 'mongoose';
import { AppError, UserRequest } from '../utils/types';
import { catchAsync } from '../utils/catchAsync';
import { HttpStatusCode } from '../enums/httpStatusCode';

const createToken = (id: UUID, next: any): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as Secret, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const saveToken = (token: String, res: Response): void => {
  const cookieOptions: CookieOptions = {
    expires: new Date(
      Date.now() +
        (process.env.JWT_COOKIE_EXPIRES_IN as unknown as number) *
          24 *
          60 *
          60 *
          1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
};

export const signup = catchAsync(
  async (req: Request, res: Response, next: any) => {
    // Use transactions in order to allow roolback in case of error
    const session: ClientSession = await mongoose.startSession();
    session.startTransaction();
    try {
      const [newContact] = await Contact.create([req.body.userContact], {
        session,
      });
      req.body.userContact = newContact._id;
      const [newUser] = await User.create([req.body], { session });
      const token = createToken(newUser._id, next);
      saveToken(token, res);
      // If everything goes well commit transactions
      await session.commitTransaction();
      // Ending the session
      session.endSession();
      res.status(201).json({ message: 'User added', newUser, token });
    } catch (error) {
      // Rollback any changes made in the database
      await session.abortTransaction();
      session.endSession();
      // Send the error
      return next(
        new AppError('Error signup: ' + (error as Error).message, 500)
      );
    }
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: any) => {
    const { email, password } = req.body;
    // Check if email and password exists;
    if (!email || !password) {
      return next(new AppError('Provide a login email and a password!', 400));
    }
    // Check if user exixts and password is correct
    const user: IUser = await User.findOne({ email }).select('+password');
    if (password == user.password) {
      return next(new AppError('Incorrect password or email!', 400));
    }
    // If everything is ok, send token to client
    const token = createToken(user._id, res);
    saveToken(token, res);
    res.status(201).json({ message: 'New Token Generated!', token });
  }
);

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
      req.user = (await User.findById(decoded.id)) as IUser;
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
