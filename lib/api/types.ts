// API Response Types

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
}

export interface User {
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: 'customer' | 'shopkeeper' | 'admin';
}

export interface Shop {
  id?: string;
  name?: string;
  address?: string;
  phone?: string;
  isOpen?: boolean;
  rating?: number;
  [key: string]: any;
}

// Auth API Types
export interface SendOtpRequest {
  phone: string;
}

export interface SendOtpResponse {
  phone: string;
  expiresIn: string;
  otp?: string; // Only in dev mode
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
}

export interface VerifyOtpResponse {
  user: User;
  token: string;
  shop: Shop;
}

// Error Response
export interface ApiError {
  status: 'error';
  message: string;
  errors?: any;
}
