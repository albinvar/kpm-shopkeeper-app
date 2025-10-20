import apiClient from '../lib/api/config';
import {
  ApiResponse,
  GetOrdersParams,
  GetOrdersResponse,
  GetOrderResponse,
  Order,
} from '../lib/api/types';

class OrderService {
  /**
   * Get customer's order history
   * GET /api/orders
   * @param params - Query parameters for filtering and pagination
   * @returns List of customer orders with pagination
   */
  async getOrders(params?: GetOrdersParams): Promise<ApiResponse<GetOrdersResponse>> {
    try {
      const response = await apiClient.get<ApiResponse<GetOrdersResponse>>(
        '/api/orders',
        { params }
      );
      return response.data;
    } catch (error: any) {
      console.error('Get Orders Error:', error.response?.data || error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Get single order details
   * GET /api/orders/:id
   * @param orderId - Order ID
   * @returns Order details
   */
  async getOrderById(orderId: string): Promise<ApiResponse<GetOrderResponse>> {
    try {
      const response = await apiClient.get<ApiResponse<GetOrderResponse>>(
        `/api/orders/${orderId}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Get Order By ID Error:', error.response?.data || error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Update order status (for shopkeepers)
   * PUT /api/orders/:id/status
   * @param orderId - Order ID
   * @param status - New order status
   * @returns Updated order
   */
  async updateOrderStatus(
    orderId: string,
    status: Order['status']
  ): Promise<ApiResponse<{ order: Order }>> {
    try {
      const response = await apiClient.put<ApiResponse<{ order: Order }>>(
        `/api/orders/${orderId}/status`,
        { status }
      );
      return response.data;
    } catch (error: any) {
      console.error('Update Order Status Error:', error.response?.data || error.message);
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
        return new Error(message || 'Order not found');
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

export default new OrderService();
