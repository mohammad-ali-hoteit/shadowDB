import { Request, Response } from 'express';
import { ILoginRequest, IRegisterRequest } from '../types';
import { registerUser, loginUser } from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
  try {
    const userData: IRegisterRequest = req.body;
    const result = await registerUser(userData);

    res.status(201).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
      });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const loginData: ILoginRequest = req.body;
    const result = await loginUser(loginData);

    res.json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
      });
    }
  }
}; 