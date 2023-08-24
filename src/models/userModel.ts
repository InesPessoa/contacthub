import mongoose, { Model, QueryWithHelpers, Schema } from 'mongoose';
import { IContact } from './contactModel';
import { UUID } from 'crypto';
import { randomBytes, createHash } from 'crypto';

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

  createPasswordResetToken(): string;
}

export interface IUserModel extends QueryWithHelpers<IUser, IUser> {} //Does this makes sence?

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
    required: [true, 'Please provide a password'], //TODO DO not foget to encrypt
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    minlength: 8,
    select: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre('save', function (next) {
  if (this.password === this.passwordConfirm) return next();
  else throw new Error('Passwords are not the same');
});

userSchema.methods.createPasswordResetToken = function (): string {
  const resetToken = randomBytes(32).toString('hex');
  this.passwordResetToken = createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // works for 10 min
  return resetToken;
};

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
