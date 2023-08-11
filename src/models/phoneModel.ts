import mongoose, { Document, Schema, model } from 'mongoose';

interface IPhone extends Document {
  phoneNumber: number;
  countryCode: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const phoneSchema = new Schema<IPhone>({
  phoneNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  countryCode: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
});

const Phone = mongoose.model<IPhone>('Phone', phoneSchema);

export default Phone;
