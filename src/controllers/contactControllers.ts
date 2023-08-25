import { Contact } from '../models/contactModel';
import { paginate } from '../utils/paginate';
import { Request, Response } from 'express';
import { UserRequest } from '../utils/types';

export const readAllContacts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { skip, limit } = paginate(req.query);
    const contacts = await Contact.find().skip(skip).limit(limit);
    res.status(200).json({ contacts });
  } catch (error) {
    throw error;
  }
};

export const readContactById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const contact = await Contact.findById({ id: req.params.id });
    res.status(200).json({ contact });
  } catch (error) {
    throw error;
  }
};

// only allowed to the owner of the contact
export const updateContactById = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    let contact = await Contact.findById({ id: req.params.id });
    contact = { ...contact, ...req.body };
    contact?.save();
    res.status(200).json({ contact });
  } catch (error) {
    throw error;
  }
};

// only allowed to the owner of the contact
export const deleteContactById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await Contact.findByIdAndDelete({ id: req.params.id });
    res.status(200).json({ message: 'User deleted!' });
  } catch (error) {
    throw error;
  }
};
