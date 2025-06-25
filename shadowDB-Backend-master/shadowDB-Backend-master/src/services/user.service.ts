import { IUser, IUserRequest } from '../types';
import { RepositoryFactory } from '../repositories/RepositoryFactory';


export const createUser = async (userData: IUserRequest): Promise<Partial<IUser>> => {
  const userRepository = RepositoryFactory.getUserRepository();
  return userRepository.create(userData);
};

export const getAllUsers = async (): Promise<Partial<IUser>[]> => {
  const userRepository = RepositoryFactory.getUserRepository();
  return userRepository.findAll();
};

export const getUserById = async (id: string): Promise<Partial<IUser>> => {
  const userRepository = RepositoryFactory.getUserRepository();
  return userRepository.findById(id);
};

export const updateUser = async (id: string, userData: Partial<IUserRequest>): Promise<Partial<IUser>> => {
  const userRepository = RepositoryFactory.getUserRepository();
  return userRepository.update(id, userData);
};

export const deleteUser = async (id: string): Promise<void> => {
  const userRepository = RepositoryFactory.getUserRepository();
  return userRepository.delete(id);
}; 