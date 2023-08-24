import { HttpStatusCode } from '../enums/httpStatusCode';
import { User } from '../models/userModel';
import { AppError } from '../utils/types';
import { UUID } from 'crypto';
import jwt, { Secret } from 'jsonwebtoken';
import process from 'process';
import { CookieOptions, Response } from 'express';

class AuthService {
  createToken = (id: UUID): string => {
    return jwt.sign({ id }, process.env.JWT_SECRET as Secret, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  };

  generateCookieOptions = (token: String) => {
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
    return cookieOptions;
  };

  verifyRequestBodyStructure(
    requiredProperties: Array<string>,
    body: any
  ): void {
    // Check if the request body has the required properties
    for (const prop of requiredProperties) {
      if (!(prop in body)) {
        throw new AppError(
          `Missing Body parameter: ${prop}`,
          HttpStatusCode.BAD_REQUEST
        );
      }
    }
  }

  async getUserByLoginEmail(email: string, includePassword: boolean) {
    //Todo replace any
    // Get the user from the database
    let user;
    if (includePassword) {
      user = await User.findOne({ loginEmail: email }).select('+password');
    } else {
      user = await User.findOne({ loginEmail: email });
    }
    //Throw an error if the user does not exist
    if (!user) {
      throw new AppError(
        'User with this email does not exist!',
        HttpStatusCode.NOT_FOUND
      );
    }
    return user;
  }

  compareAuthStrings(authString: string, authStringProvided: string) {
    // Can be used to verify the following cases:
    // 1. password and passwordConfirm are not the same
    // 2. password and passwordProvided are not the same
    // 3. passwordResetToken and passwordResetTokenProvided are not the same
    if (authString !== authStringProvided) {
      throw new AppError(
        'The autenticathion strings do not match!',
        HttpStatusCode.BAD_REQUEST
      );
    }
  }

  verifyExpirationDate(expirationDate: Date | unknown): void {
    if (!expirationDate) {
      // Check if the token has expired
      if ((expirationDate as Date) < new Date()) {
        throw new AppError(
          'The token has expired!',
          HttpStatusCode.UNOUTHORIZED
        );
      }
      throw new AppError(
        'Something went wrong! There is no experation date associated with this token!',
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const authService = new AuthService();
