import mongoose, { Model, QueryWithHelpers, Schema } from 'mongoose';
import { IContact } from './contactModel';
import { UUID } from 'crypto';
import { Roles } from '../enums/roles';

export interface IUser extends mongoose.Document {
  _id: UUID;
  loginEmail: string;
  userContact: IContact;
  contacts?: IContact[];
  password: string;
  passwordConfirm: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Number; //TODO: Check if this is the correct type
  role: Roles;
}

export interface IUserModel extends QueryWithHelpers<IUser, IUser> {} //Does this makes sence?

const userSchema = new Schema<IUser>({
  loginEmail: {
    type: String,
    required: [true, 'Please provide a login email'],
    unique: true,
    lowercase: true,
    immutable: true,
  },
  userContact: {
    type: Schema.Types.ObjectId,
    ref: 'Contact',
    required: true,
  },
  contacts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Contact',
      required: false,
    },
  ],
  role: {
    type: String,
    enum: Object.values(Roles),
    default: Roles.USER,
    immutable: true,
  },
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
  passwordResetExpires: Number,
});

userSchema.pre('save', function (next) {
  if (this.password === this.passwordConfirm) return next();
  else throw new Error('Passwords are not the same');
});

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
