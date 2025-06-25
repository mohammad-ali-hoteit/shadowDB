import { IUser, IUserRequest } from '../types';
import User from '../models/User';
import { hashPassword } from '../utils/auth';
import { AppError } from '../middlewares/error';
import { IUserRepository } from './interfaces/IUserRepository';

export class UserRepository implements IUserRepository {
  async create(userData: IUserRequest): Promise<Partial<IUser>> {
    const passwordHash = await hashPassword(userData.password);

    const user = await User.create({
      ...userData,
      passwordHash,
    });

    return {
      _id: user._id,
      email: user.email,
      role: user.role,
    };
  }

  async findAll(): Promise<Partial<IUser>[]> {
    return User.find().select('-passwordHash').sort({ createdAt: -1 });
  }

  async findById(userId: string): Promise<Partial<IUser>> {
    const user = await User.findOne({userId}).select('-passwordHash');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }

  async update(userId: string, userData: Partial<IUserRequest>): Promise<Partial<IUser>> {
    const updateData: any = { ...userData };

    if (userData.password) {
      updateData.passwordHash = await hashPassword(userData.password);
    }

    const user = await User.findOneAndUpdate({userId}, updateData, {
      new: true,
      runValidators: true,
    }).select('-passwordHash');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async delete(userId: string): Promise<void> {
    const user = await User.findOneAndDelete({userId});

    if (!user) {
      throw new AppError('User not found', 404);
    }
  }
} 