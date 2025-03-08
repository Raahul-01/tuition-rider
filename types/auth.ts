import { z } from 'zod';

// User registration schema
export const userRegistrationSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

// User login schema
export const userLoginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required')
});

// Admin login schema
export const adminLoginSchema = z.object({
  registrationNumber: z.string().min(1, 'Registration number is required'),
  password: z.string().min(1, 'Password is required')
});

// Role type
export type UserRole = 'USER' | 'ADMIN';

// User profile interface
export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  registrationNumber?: string;
  registrationDate: Date;
  lastLogin?: Date;
  failedAttempts: number;
  lockedUntil?: Date;
  loginCount: number;
}

// Auth error types
export type AuthErrorType = 
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_EXISTS'
  | 'RATE_LIMIT_EXCEEDED'
  | 'UNAUTHORIZED'
  | 'SERVER_ERROR'
  | 'VALIDATION_ERROR';

export class AuthError extends Error {
  constructor(
    public type: AuthErrorType,
    message: string
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export type UserRegistrationData = z.infer<typeof userRegistrationSchema>;
export type UserLoginData = z.infer<typeof userLoginSchema>;
export type AdminLoginData = z.infer<typeof adminLoginSchema>;

// Form data type that combines all possible fields
export type FormData = {
  fullName?: string;
  phone?: string;
  email?: string;
  password: string;
  registrationNumber?: string;
}; 