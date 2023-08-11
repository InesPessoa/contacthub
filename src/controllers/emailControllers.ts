//make CRUD Controllers for email
import { Request, Response } from 'express';
import { IEmail, Email } from '../models/emailModel';

//create email, read email by id, update email by id, delete email

//create a create controller
export const createEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const body = req.body as Required<Pick<IEmail, 'email'>> & Partial<IEmail>;
    const email: IEmail = new Email({
      email: body.email,
      description: body.description,
    });
    const newEmail: IEmail = await email.save();
    res.status(201).json({ message: 'Email added', email: newEmail });
  } catch (error) {
    throw error;
  }
};

export const readEmails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const emails = await Email.find();
    res.status(200).json({ emails });
  } catch (error) {
    throw error;
  }
};
