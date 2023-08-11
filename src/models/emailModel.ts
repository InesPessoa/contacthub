import mongoose, { Document, Schema, model } from 'mongoose';

export interface IEmail extends Document {
  email: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const emailSchema = new Schema<IEmail>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: false,
  },
});

export const Email = mongoose.model<IEmail>('Email', emailSchema);
