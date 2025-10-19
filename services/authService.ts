import apiClient from '../lib/api/config';
import {
  ApiResponse,
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from '../lib/api/types';

class AuthService {
  /**
   * Send OTP to phone number for passwordless login
   * @param phone - Phone number with country code (e.g., "+919876543210")
   * @returns Promise with OTP response
   */
  async sendOtp(phone: string): Promise<ApiResponse<SendOtpResponse>> {
    try {
      const payload: SendOtpRequest = { phone };
      const response = await apiClient.post<ApiResponse<SendOtpResponse>>(
        '/api/auth/send-otp',
        payload
      );
      return response.data;
    } catch (error: any) {
      console.error('Send OTP Error:', error.response?.data || error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Verify OTP and login
   * @param phone - Phone number with country code
   * @param otp - 4-digit OTP
   * @returns Promise with user data, token, and shop info
   */
  async verifyOtp(phone: string, otp: string): Promise<ApiResponse<VerifyOtpResponse>> {
    try {
      const payload: VerifyOtpRequest = { phone, otp };
      const response = await apiClient.post<ApiResponse<VerifyOtpResponse>>(
        '/api/auth/verify-otp',
        payload
      );
      return response.data;
    } catch (error: any) {
      console.error('Verify OTP Error:', error.response?.data || error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors and format them consistently
   */
  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || 'An error occurred';
      return new Error(message);
    } else if (error.request) {
      // Request made but no response
      return new Error('Network error. Please check your connection.');
    } else {
      // Something else happened
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export default new AuthService();
