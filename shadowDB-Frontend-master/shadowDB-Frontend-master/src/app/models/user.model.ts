export interface User {
  userId?: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
  createdAt?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: 'admin' | 'user';
}

export interface AuthResponse {
  status: string;
  data: {
    token: string;
    user: User;
  };
} 