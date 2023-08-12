import mongoose, { Document, Schema, model } from 'mongoose';

export interface Email {
  email: string;
  description?: string;
}

export interface Phone {
  phoneNumber: number;
  countryCode: number; //TODO: make this an Enum
  description?: string;
}

export interface IUser {
  username: string;
  firstName: string;
  lastName: string;
  bio?: string;
  emails: Email[];
  phones: Phone[];
  users: IUser[];
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: false,
  },
  //TODO  emails and phones, validate that they are unique and valid;

  //TODO add users, validate them
});

export const User = mongoose.model<IUser>('User', userSchema);
