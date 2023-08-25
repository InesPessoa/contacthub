import { Request, Response } from 'express';
import { IUser, User } from '../models/userModel';
import { Contact } from '../models/contactModel';
import { UserRequest } from '../utils/types';
import { paginate } from '../utils/paginate';

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

export const readAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { skip, limit } = paginate(req.query);
    let users = await User.find().skip(skip).limit(limit);
    res.status(200).json({ users });
  } catch (error) {
    throw error;
  }
};

export const readUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById({ id: req.params.id });
    user?.populate('userContact');
    res.status(200).json({ user });
  } catch (error) {
    throw error;
  }
};

export const readUserMe = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    throw error;
  }
};

export const updateUserMe = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    const user = (req.user as IUser).updateOne(req.body);
    res.status(200).json({ user });
  } catch (error) {
    throw error;
  }
};

export const deleteUserMe = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    (req.user as IUser).deleteOne();
    res.status(200).json({ message: 'User deleted!' });
  } catch (error) {
    throw error;
  }
};
