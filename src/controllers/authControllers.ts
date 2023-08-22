import process from 'process';
import { Request, Response } from 'express';
import { Contact } from '../models/contactModel';
import { IUser, User } from '../models/userModel';
import mongoose, { ClientSession, Model } from 'mongoose';
import { AppError, UserRequest } from '../utils/types';
import { catchAsync } from '../utils/catchAsync';
import { HttpStatusCode } from '../enums/httpStatusCode';
import { sendEmail } from '../utils/email';
import { authService } from '../services/authService';

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
      const token = authService.createToken(newUser._id, next);
      authService.saveToken(token, res);
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
    // Check body, if email and password exists;
    authService.verifyRequestBodyStructure(['email', 'password'], req.body);
    const { email, password } = req.body;
    // Get user by email
    const user = await authService.getUserByLoginEmail(email, true);
    // Check if user exists and password is correct
    authService.compareAuthStrings(user.password, password);
    // If everything is ok, send token to client
    const token = authService.createToken(user._id, res);
    authService.saveToken(token, res);
    res.status(201).json({ message: 'New Token Generated!', token });
  }
);

export const forgotPassword = catchAsync(
  async (req: UserRequest, res: Response, next: any) => {
    // Get used based on posted email
    const user = await authService.getUserByLoginEmail(req.body.email, false);
    // Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    // Send it to users's email
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and
  passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email.`;

    try {
      await sendEmail({
        emailFrom: process.env.EMAIL_FROM as string,
        emailTo: user.loginEmail,
        subject: 'Your password reset token (valid for 10 min)',
        message,
      });
      res.status(200).json({
        status: 'sucess',
        message: 'Token sent to email!',
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      return next(
        new AppError(
          'There was an error sending the email: ' + (err as Error).message,
          500
        )
      );
    }
  }
);

export const updatePassword = catchAsync(
  async (req: UserRequest, res: Response, next: any) => {
    //Get user
    const user = await authService.getUserByLoginEmail(req.body.email, false);
    //Check if the recover token is still valid
    authService.verifyExpirationDate(user.passwordResetExpires);
    //Check if the recoverToken is correct
    authService.compareAuthStrings(
      user.passwordResetToken as string,
      req.body.token //Todo change to query parameters
    );
    //Compare new passwords provided
    authService.compareAuthStrings(req.body.password, req.body.passwordConfirm);
    //update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    //save
    await user.save(); //Todo check if this is the correct way to save
    // If everything is ok, send token to client
    const token = authService.createToken(user._id, res);
    authService.saveToken(token, res);
    res
      .status(201)
      .json({ message: 'Password changed and new token generated!', token });
  }
);
