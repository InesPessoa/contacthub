import mongoose, { Schema } from 'mongoose';

export interface IContact {
  firstName: string;
  lastName: string;
  bio?: string;
  email: string;
  phone: number;
  countryCode: number;
}

const contactSchema = new Schema<IContact>({
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
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
  },
  phone: {
    type: Number,
    required: [true, 'Please provide your phone'],
    unique: true,
  },
  countryCode: {
    type: Number, //Todo convert in enum
    required: [true, 'Please provide your country code'],
  },
});

export const Contact = mongoose.model<IContact>('Contact', contactSchema);
