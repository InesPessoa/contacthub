import { Contact } from '../models/contactModel';
import { paginate } from '../utils/paginate';
import { Request, Response } from 'express';
import { AppError, UserRequest } from '../utils/types';
import { catchAsync } from '../utils/catchAsync';
import { HttpStatusCode } from '../enums/httpStatusCode';

export const readMyContact = catchAsync(
  async (req: UserRequest, res: Response): Promise<void> => {
    try {
      const myContact = req.user?.userContact;
      res.status(200).json({ myContact });
    } catch (error) {
      throw new AppError(
        (error as Error).message,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }
);

export const readAllContacts = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { skip, limit } = paginate(req.query);
      const contacts = await Contact.find().skip(skip).limit(limit);
      res.status(200).json({ contacts });
    } catch (error) {
      throw new AppError(
        (error as Error).message,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }
);

export const readContactById = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const contact = await Contact.findById({ _id: req.params.id });
      res.status(200).json({ contact });
    } catch (error) {
      throw new AppError(
        (error as Error).message,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }
);

export const updateContactById = catchAsync(
  async (req: UserRequest, res: Response): Promise<void> => {
    try {
      let contact = await Contact.findById({ _id: req.params.id });
      contact = { ...contact, ...req.body };
      contact?.save();
      res.status(200).json({ contact });
    } catch (error) {
      throw new AppError(
        (error as Error).message,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }
);

export const deleteContactById = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    try {
      await Contact.findByIdAndDelete({ _id: req.params.id });
      res.status(200).json({ message: 'User deleted!' });
    } catch (error) {
      throw new AppError(
        (error as Error).message,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }
);
