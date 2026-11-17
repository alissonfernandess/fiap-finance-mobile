export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  photoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO {
  email: string;
  name: string;
  phone?: string;
  password: string;
}

export interface UpdateUserDTO {
  name?: string;
  phone?: string;
  photoUrl?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  phone: string;
  email: string;
  password: string;
}