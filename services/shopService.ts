import apiClient from '../lib/api/config';
import {
  ApiResponse,
  GetDashboardResponse,
  GetShopResponse,
  GetShopOrdersParams,
  GetShopOrdersResponse,
  UpdateBasicInfoRequest,
  UpdateContactInfoRequest,
  UpdateAddressRequest,
  UpdateBusinessHoursRequest,
  UpdateSettingsRequest,
  UpdateBankDetailsRequest,
  Shop,
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
   * Update shop basic information
   * PUT /api/shops/:id/basic-info
   * @param shopId - Shop ID
   * @param data - Basic info to update
   * @returns Updated shop information
   */
  async updateBasicInfo(
    shopId: string,
    data: UpdateBasicInfoRequest
  ): Promise<ApiResponse<{ shop: Shop }>> {
    try {
      const response = await apiClient.put<ApiResponse<{ shop: Shop }>>(
        `/api/shops/${shopId}/basic-info`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('Update Basic Info Error:', error.response?.data || error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Update shop contact information
   * PUT /api/shops/:id/contact
   * @param shopId - Shop ID
   * @param data - Contact info to update
   * @returns Updated shop information
   */
  async updateContactInfo(
    shopId: string,
    data: UpdateContactInfoRequest
  ): Promise<ApiResponse<{ shop: Shop }>> {
    try {
      const response = await apiClient.put<ApiResponse<{ shop: Shop }>>(
        `/api/shops/${shopId}/contact`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('Update Contact Info Error:', error.response?.data || error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Update shop address
   * PUT /api/shops/:id/address
   * @param shopId - Shop ID
   * @param data - Address to update
   * @returns Updated shop information
   */
  async updateAddress(
    shopId: string,
    data: UpdateAddressRequest
  ): Promise<ApiResponse<{ shop: Shop }>> {
    try {
      const response = await apiClient.put<ApiResponse<{ shop: Shop }>>(
        `/api/shops/${shopId}/address`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('Update Address Error:', error.response?.data || error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Update shop business hours
   * PUT /api/shops/:id/business-hours
   * @param shopId - Shop ID
   * @param data - Business hours to update
   * @returns Updated shop information
   */
  async updateBusinessHours(
    shopId: string,
    data: UpdateBusinessHoursRequest
  ): Promise<ApiResponse<{ shop: Shop }>> {
    try {
      const response = await apiClient.put<ApiResponse<{ shop: Shop }>>(
        `/api/shops/${shopId}/business-hours`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('Update Business Hours Error:', error.response?.data || error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Update shop settings
   * PUT /api/shops/:id/settings
   * @param shopId - Shop ID
   * @param data - Settings to update
   * @returns Updated shop information
   */
  async updateSettings(
    shopId: string,
    data: UpdateSettingsRequest
  ): Promise<ApiResponse<{ shop: Shop }>> {
    try {
      const response = await apiClient.put<ApiResponse<{ shop: Shop }>>(
        `/api/shops/${shopId}/settings`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('Update Settings Error:', error.response?.data || error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Update shop bank details
   * PUT /api/shops/:id/bank-details
   * @param shopId - Shop ID
   * @param data - Bank details to update
   * @returns Bank details
   */
  async updateBankDetails(
    shopId: string,
    data: UpdateBankDetailsRequest
  ): Promise<ApiResponse<{ bankDetails: any }>> {
    try {
      const response = await apiClient.put<ApiResponse<{ bankDetails: any }>>(
        `/api/shops/${shopId}/bank-details`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('Update Bank Details Error:', error.response?.data || error.message);
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
