import { Request, Response } from 'express';
import { IUserRequest } from '../types';
import {
  createUser as createUserService,
  getAllUsers,
  getUserById,
  updateUser as updateUserService,
  deleteUser as deleteUserService,
} from '../services/user.service';

export const createUser = async (req: Request, res: Response) => {
  try {
    const userData: IUserRequest = req.body;
    const user = await createUserService(userData);

    res.status(201).json({
      status: 'success',
      data: { user },
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

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsers();

    res.json({
      status: 'success',
      data: { users },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await getUserById(req.body.userId);

    res.json({
      status: 'success',
      data: { user },
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

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userData: Partial<IUserRequest> = req.body;
    const user = await updateUserService(req.body.userId, userData);

    res.json({
      status: 'success',
      data: { user },
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

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await deleteUserService(req.body.userId);

    res.json({
      status: 'success',
      data: null,
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