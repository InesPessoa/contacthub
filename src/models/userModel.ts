import mongoose, { Schema } from 'mongoose';
import { IContact } from './contactModel';
import { UUID } from 'crypto';
import compare from 'bcrypt';

export interface IUser {
  _id: UUID;
  username: string;
  loginEmail: string;
  userContact: IContact;
  pendingRequestContacts?: IContact[];
  contacts?: IContact[];
  password: string;
  passwordConfirm: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, 'Please provide your username'],
    unique: true,
    lowercase: true,
  },
  loginEmail: {
    type: String,
    required: [true, 'Please provide a login email'],
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
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre('save', function (next) {
  if (this.password === this.passwordConfirm) return next();
});

// userSchema.methods.verifyPassword = async (
//   candidatePassword: string,
//   userPassword: string
// ): Promise<boolean> => {
//   return await compare.compare(candidatePassword, userPassword);
// };

export const User = mongoose.model<IUser>('User', userSchema);
