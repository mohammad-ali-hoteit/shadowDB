import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { IUser } from '../types';

export const generateToken = (user: IUser): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '24h') as jwt.SignOptions['expiresIn'],
  };
  
  return jwt.sign(
    { _id: user._id },
    process.env.JWT_SECRET || 'your-super-secret-key',
    options
  );
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePasswords = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
}; 