import { Request } from 'express';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export interface IUser {
  _id: string;
  userId: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
}

export interface ICompany {
  _id: string;
  companyId: string;
  names: string[];
  location: string;
  owner: string;
  phone: string;
  email: string;
  notes?: string;
  logoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthRequest extends Request {
  user?: IUser;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  userId: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface ICompanyRequest {
  names: string[];
  location: string;
  owner: string;
  phone: string;
  email: string;
  notes?: string;
  logoUrl?: string;
}

export interface IUserRequest {
  email: string;
  password: string;
  role: UserRole;
} 