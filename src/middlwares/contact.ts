import { HttpStatusCode } from '../enums/httpStatusCode';
import { Response } from 'express';
import { AppError, UserRequest } from '../utils/types';

export const verifyContact = (req: UserRequest, res: Response, next: any) => {
  return (req: UserRequest, res: Response, next: any) => {
    const verifyUser = req.user?.contacts
      ?.map((contact) => contact._id as string)
      .includes(req.params.id);
    if (!verifyUser) {
      throw new AppError(
        'You are not allowed to update this contact!',
        HttpStatusCode.UNAUTHORIZED
      );
    }
  };
};
