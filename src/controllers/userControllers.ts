//make CRUD Controllers for email
import { Request, Response } from 'express';
import { User } from '../models/userModel';
import { Contact } from '../models/contactModel';
import { UserRequest } from '../utils/types';

export const createUser = async (req: Request, res: Response, next: any) => {
  try {
    const newContact = await Contact.create(req.body.userContact);
    req.body.userContact = newContact._id;
    const newUser = await User.create(req.body);
    res.status(201).json({ message: 'User added', email: newUser });
  } catch (error) {
    return next(error);
  }
};

export const readUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    throw error;
  }
};

export const readUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById({ id: 1 });
    user?.populate('userContact');
    res.status(200).json({ user });
  } catch (error) {
    throw error;
  }
};

export const readMe = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    throw error;
  }
};
