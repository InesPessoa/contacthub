import { Request, Response } from 'express';
import { User } from '../models/userModel';
import { Contact } from '../models/contactModel';
import { UserRequest } from '../utils/types';

//TODO only allowed for admin
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

//TODO only allowed for admin
export const readAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    throw error;
  }
};

//TODO only allowed for admin
export const readUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById({ id: 1 });
    user?.populate('userContact');
    res.status(200).json({ user });
  } catch (error) {
    throw error;
  }
};

//Todo delete user, only allowed for admim

export const readUserMe = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    res.status(200).json({ user: req.user }); //Use standart response
  } catch (error) {
    throw error;
  }
};

//Todo update user me
//Todo delete user me
