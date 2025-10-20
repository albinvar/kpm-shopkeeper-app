import apiClient from '../lib/api/config';
import {
  ApiResponse,
  GetDashboardResponse,
  GetShopResponse,
  GetShopOrdersParams,
  GetShopOrdersResponse,
} from '../lib/api/types';

class ShopService {
  /**
   * Get shop dashboard analytics
   * GET /api/shops/:id/dashboard
   * @param shopId - Shop ID
   * @returns Dashboard stats with revenue, orders, and analytics
   */
  async getDashboard(shopId: string): Promise<ApiResponse<GetDashboardResponse>> {
    try {
      const response = await apiClient.get<ApiResponse<GetDashboardResponse>>(
        `/api/shops/${shopId}/dashboard`
      );
      return response.data;
    } catch (error: any) {
      console.error('Get Dashboard Error:', error.response?.data || error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Get shop details
   * GET /api/shops/:id
   * @param shopId - Shop ID
   * @returns Shop information
   */
  async getShopDetails(shopId: string): Promise<ApiResponse<GetShopResponse>> {
    try {
      const response = await apiClient.get<ApiResponse<GetShopResponse>>(
        `/api/shops/${shopId}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Get Shop Details Error:', error.response?.data || error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Get all shop orders with optional filters
   * GET /api/shops/:id/orders
   * @param shopId - Shop ID
   * @param params - Query parameters for filtering and pagination
   * @returns List of orders with pagination
   */
  async getShopOrders(
    shopId: string,
    params?: GetShopOrdersParams
  ): Promise<ApiResponse<GetShopOrdersResponse>> {
    try {
      const response = await apiClient.get<ApiResponse<GetShopOrdersResponse>>(
        `/api/shops/${shopId}/orders`,
        { params }
      );
      return response.data;
    } catch (error: any) {
      console.error('Get Shop Orders Error:', error.response?.data || error.message);
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
        return new Error(message || 'Shop not found');
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

export default new ShopService();
