import { Request, Response } from 'express';
import { IUser, User } from '../models/userModel';
import { Contact } from '../models/contactModel';
import { UserRequest } from '../utils/types';
import { paginate } from '../utils/paginate';
import { catchAsync } from '../utils/catchAsync';

export const createUser = catchAsync(
  async (req: Request, res: Response, next: any) => {
    const newContact = await Contact.create(req.body.userContact);
    req.body.userContact = newContact._id;
    const newUser = await User.create(req.body);
    res.status(201).json({ message: 'User added', user: newUser });
  }
);

export const readAllUsers = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { skip, limit } = paginate(req.query);
    let users = await User.find().skip(skip).limit(limit);
    res.status(200).json({ users });
  }
);

export const readUserById = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const user = await User.findById({ id: req.params.id });
    user?.populate('userContact'); //TODO HANDLE POPULATE
    res.status(200).json({ user });
  }
);

export const readUserMe = catchAsync(
  async (req: UserRequest, res: Response): Promise<void> => {
    res.status(200).json({ user: req.user });
  }
);

export const updateUserMe = catchAsync(
  async (req: UserRequest, res: Response): Promise<void> => {
    if (req.body.userContact) {
      const contact = await Contact.findByIdAndUpdate(
        req.user?.userContact._id,
        req.body.userContact
      ); //TODO HANDLE CREATE ON CONTACT, rollback if error
      delete req.body.userContact;
    }
    const user = (req.user as IUser).updateOne(req.body); //TODO HANDLE UPDATE ON CONTACT, rollback if error
    res.status(200).json({ message: 'User updated', user });
  }
);

export const deleteUserMe = catchAsync(
  async (req: UserRequest, res: Response): Promise<void> => {
    (req.user as IUser).deleteOne();
    res.status(200).json({ message: 'User deleted!' });
  }
);
