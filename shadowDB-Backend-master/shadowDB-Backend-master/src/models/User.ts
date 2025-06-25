import mongoose, { Schema } from 'mongoose';
import { IUser, UserRole } from '../types';
import { v4 as uuidv4 } from 'uuid';

const UserSchema = new Schema<IUser>(
  {
    userId: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      default: () => generateAdminId()
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const generateAdminId = (): string => {
  // Take first 6 characters of UUID
  const random = uuidv4().substring(0, 6).toUpperCase();

  return `UID-${random}`;
};

export default mongoose.model<IUser>('User', UserSchema); 