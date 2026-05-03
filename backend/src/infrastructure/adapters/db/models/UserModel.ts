import mongoose, { Schema, Document } from 'mongoose';
import { User } from '../../../../domain/entities/User';

export type UserDocument = Omit<User, 'id'> & Document;

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'owner', 'admin'], default: 'customer' },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } },
);

export const UserModel = mongoose.model<UserDocument>('User', userSchema);
