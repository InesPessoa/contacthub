import { UUID } from 'crypto';
import jwt, { Jwt, JwtPayload, Secret } from 'jsonwebtoken';
import process from 'process';
import { CookieOptions, Request, Response } from 'express';
import { Contact } from '../models/contactModel';
import { IUser, User } from '../models/userModel';
import mongoose, { ClientSession } from 'mongoose';
import { UserRequest } from '../types';

const createToken = (id: UUID, next: any): string => {
  let token;
  try {
    console.log('start createToken');
    token = jwt.sign({ id }, process.env.JWT_SECRET as Secret, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    console.log('end createToken');
  } catch (error) {
    return next(error);
  }
  return token;
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

export const signup = async (req: Request, res: Response, next: any) => {
  const session: ClientSession = await mongoose.startSession();
  session.startTransaction();
  try {
    const [newContact] = await Contact.create([req.body.userContact], {
      session,
    });
    req.body.userContact = newContact._id;
    const [newUser] = await User.create([req.body], { session });
    await session.commitTransaction();
    const token = createToken(newUser._id, next);
    saveToken(token, res);
    res.status(201).json({ message: 'User added', newUser, token });
  } catch (error) {
    // Rollback any changes made in the database
    await session.abortTransaction();
    session.endSession();
    // Rethrow the error
    return next(error);
  }
  // Ending the session
  session.endSession();
};

export const login = async (req: Request, res: Response, next: any) => {
  const { email, password } = req.body;

  // 1) check if email and password exists;
  if (!email || !password) {
    res.status(400); //Todo correct this
  }
  // 2) check if user exixts and password is correct
  const user: IUser = await User.findOne({ email }).select('+password');
  if (password == user.password) {
    return next('Incorrect email or password'); //Todo correct this
  }

  // 3) if everything is ok, send token to client
  const token = createToken(user._id, res);
  saveToken(token, res);
  res.status(201).json({ message: 'New Token', token });
};

export const protect = async (req: UserRequest, res: Response, next: any) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    const token = req.headers.authorization.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(
        token as unknown as string,
        process.env.JWT_SECRET as Secret
      ) as JwtPayload; //Todo handle with jwt expired
    } catch (error) {
      return next(error);
    }
    req.user = (await User.findById(decoded.id)) as IUser;
    console.log('end protect');
    next();
  } else {
    next('You are not logged in! Please log in to get acess', 401);
  }
};
