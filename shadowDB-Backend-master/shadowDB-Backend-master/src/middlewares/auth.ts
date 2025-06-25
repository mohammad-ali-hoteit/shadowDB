import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IAuthRequest, UserRole } from '../types';
import User from '../models/User';

export const auth = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Please authenticate.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-key-23') as { _id: string };
    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
      return res.status(401).json({ error: 'Please authenticate.' });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Please authenticate.' });
  }
};

export const adminAuth = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Please authenticate.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-key') as { _id: string };
    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
      return res.status(401).json({ error: 'Please authenticate.' });
    }

    if (user.role !== UserRole.ADMIN) {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Please authenticate.' });
  }
}; 