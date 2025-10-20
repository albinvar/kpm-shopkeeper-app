import apiClient from '../lib/api/config';
import {
  ApiResponse,
  UserProfile,
  UpdateProfileRequest,
} from '../lib/api/types';

class UserService {
  /**
   * Get user profile with role-specific data
   * GET /api/users/profile
   * @returns User profile including shop data for shopkeepers
   */
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    try {
      const response = await apiClient.get<ApiResponse<UserProfile>>(
        '/api/users/profile'
      );
      return response.data;
    } catch (error: any) {
      console.error('Get Profile Error:', error.response?.data || error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Get current user data with shop details (for shop owners)
   * GET /api/auth/me
   * @returns User and shop data
   */
  async getMe(): Promise<ApiResponse<{ user: any; shop: any }>> {
    try {
      console.log('📡 Fetching user details from /api/auth/me');
      const response = await apiClient.get<ApiResponse<{ user: any; shop: any }>>(
        '/api/auth/me'
      );

      console.log('✅ /api/auth/me Response:', JSON.stringify(response.data, null, 2));

      return response.data;
    } catch (error: any) {
      console.error('❌ Get Me Error:', error.response?.data || error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Update user profile
   * PUT /api/users/profile
   * @param data - Profile data to update
   * @returns Updated user profile
   */
  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<UserProfile>> {
    try {
      const response = await apiClient.put<ApiResponse<UserProfile>>(
        '/api/users/profile',
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('Update Profile Error:', error.response?.data || error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors and format them consistently
   */
  private handleError(error: any): Error {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message;

      if (status === 404) {
        return new Error(message || 'User not found');
      } else if (status === 401) {
        return new Error(message || 'Unauthorized access');
      } else if (status === 403) {
        return new Error(message || 'Access forbidden');
      } else if (status === 400) {
        return new Error(message || 'Invalid request');
      } else {
        return new Error(message || 'An error occurred');
      }
    } else if (error.request) {
      return new Error('Network error. Please check your internet connection.');
    } else {
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export default new UserService();
