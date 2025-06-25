import { IUser, IUserRequest } from '../../types';

export interface IUserRepository {
  create(userData: IUserRequest): Promise<Partial<IUser>>;
  findAll(): Promise<Partial<IUser>[]>;
  findById(userId: string): Promise<Partial<IUser>>;
  findByEmail(email: string): Promise<IUser | null>;
  update(userId: string, userData: Partial<IUserRequest>): Promise<Partial<IUser>>;
  delete(userId: string): Promise<void>;
} 