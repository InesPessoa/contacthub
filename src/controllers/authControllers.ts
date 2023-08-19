import { UUID } from 'crypto';
import jwt, { Secret } from 'jsonwebtoken';
import process from 'process';
import { Request, Response } from 'express';
import { Contact, IContact } from '../models/contactModel';
import { User } from '../models/userModel';
import mongoose, { ClientSession } from 'mongoose';

const createToken = (id: UUID, res: Response): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as Secret, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
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
    const token = createToken(newUser._id, res);
    await session.commitTransaction();
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

// export const login = async (req: Request, res: Response, next: any) => {
//   const { email, password } = req.body;

//   // 1) check if email and password exists;
//   if (!email || !password) {
//     res.status(400);
//   }
//   // 2) check if user exixts and password is correct
//   const user = await User.findOne({ email }).select('+password');
//   if (!user || !(await user.correctPassword(password, user.password)) {
//     return next(new AppError('Incorrect email or password', 401));
//   }

//   //3) if everything is ok, send token to client
//   createSendToken(user, 200, res);
// };
