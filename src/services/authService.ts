import { HttpStatusCode } from '../enums/httpStatusCode';
import { IUser, IUserModel, User } from '../models/userModel';
import { AppError } from '../utils/types';
import { UUID } from 'crypto';
import jwt, { Secret } from 'jsonwebtoken';
import { Query } from 'mongoose';
import process from 'process';
import { CookieOptions, Response } from 'express';
import { Document, Model } from 'mongoose';

class AuthService {
  createToken = (id: UUID, next: any): string => {
    return jwt.sign({ id }, process.env.JWT_SECRET as Secret, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  };

  saveToken = (token: String, res: Response): void => {
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

  verifyRequestBodyStructure(
    requiredProperties: Array<string>,
    body: any
  ): void {
    // Check if the request body has the required properties
    for (const prop of requiredProperties) {
      if (!(prop in body)) {
        new AppError(
          `Missing Body parameter: ${prop}`,
          HttpStatusCode.BAD_REQUEST
        ); // Missing required property
      }
    }
  }

  async getUserByLoginEmail(
    email: string,
    includePassword: boolean
  ): Promise<IUserModel> {
    // Get the user from the database
    let user;
    if (includePassword) {
      user = await User.findOne({ loginEmail: email }).select('+password');
    } else {
      user = await User.findOne({ loginEmail: email });
    }
    //Throw an error if the user does not exist
    if (!user) {
      new AppError(
        'User with this email does not exist!',
        HttpStatusCode.NOT_FOUND
      );
    }
    return user as unknown as IUserModel;
  }

  compareAuthStrings(authString: string, authStringProvided: string): void {
    // Can be used to verify the following cases:
    // 1. password and passwordConfirm are not the same
    // 2. password and passwordProvided are not the same
    // 3. passwordResetToken and passwordResetTokenProvided are not the same
    if (authString !== authStringProvided) {
      new AppError(
        'The autenticathion strings do not match!',
        HttpStatusCode.BAD_REQUEST
      );
    }
  }

  verifyExpirationDate(expirationDate: Date | unknown): void {
    if (!expirationDate) {
      new AppError(
        'Something went wrong!',
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
      // Check if the token has expired
      if ((expirationDate as Date) < new Date()) {
        new AppError('The token has expired!', HttpStatusCode.UNOUTHORIZED);
      }
    }
  }
}

export const authService = new AuthService();
