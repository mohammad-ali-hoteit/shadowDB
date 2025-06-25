import { ILoginRequest, IRegisterRequest, IUser, UserRole } from '../types';
import { generateToken, comparePasswords } from '../utils/auth';
import { AppError } from '../middlewares/error';
import { RepositoryFactory } from '../repositories/RepositoryFactory';

export const registerUser = async (userData: IRegisterRequest): Promise<{ user: Partial<IUser>; token: string }> => {
    const userRepository = RepositoryFactory.getUserRepository();

    // Check if user already exists
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
        throw new AppError('Email already registered', 400);
    }

    // Create new user
    const user = await userRepository.create({
        email: userData.email,
        password: userData.password,
        role: userData.role || UserRole.USER,
    });

    // Generate token
    const token = generateToken(user as IUser);

    return {
        user,
        token,
    };
};

export const loginUser = async (loginData: ILoginRequest): Promise<{ user: Partial<IUser>; token: string }> => {
    const userRepository = RepositoryFactory.getUserRepository();

    // Find user
    const user = await userRepository.findByEmail(loginData.email);
    if (!user) {
        throw new AppError('Invalid email or password', 401);
    }

    // Check password
    const isPasswordValid = await comparePasswords(loginData.password, user.passwordHash);
    if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 401);
    }

    // Generate token
    const token = generateToken(user);

    return {
        user: {
            _id: user._id,
            email: user.email,
            role: user.role,
            userId: user.userId,
            createdAt: user.createdAt,
        },
        token,
    };
}; 