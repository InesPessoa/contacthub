import mongoose, { Schema } from 'mongoose';
import { IContact } from './contactModel';

export interface IUser {
  username: string;
  userContact: IContact;
  pendingRequestContacts?: IContact[];
  contacts?: IContact[];
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, 'Please provide your username'],
    unique: true,
    lowercase: true,
  },
  userContact: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  pendingRequestContacts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  ],
  contacts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  ],
});

export const User = mongoose.model<IUser>('User', userSchema);
