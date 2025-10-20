// API Response Types

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: 'customer' | 'shopkeeper' | 'admin';
  profileImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Shop {
  id: string;
  businessName: string; // Changed from 'name' to match API
  description?: string;
  address: {
    coordinates: {
      latitude: number;
      longitude: number;
    };
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode?: string;
  };
  contactInfo?: {
    phone?: string;
    email?: string;
  };
  isOpen: boolean;
  rating?: number;
  ownerId?: string;
  category?: string;
  image?: string;
  bannerImage?: string;
  openingHours?: {
    monday?: { open: string; close: string };
    tuesday?: { open: string; close: string };
    wednesday?: { open: string; close: string };
    thursday?: { open: string; close: string };
    friday?: { open: string; close: string };
    saturday?: { open: string; close: string };
    sunday?: { open: string; close: string };
  };
  stats?: {
    totalOrders: number;
    totalRevenue: number;
  };
  deliveryRadius?: number;
  deliveryFee?: number;
  minOrderAmount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  id: string;
  orderNumber?: string;
  customerId: string;
  shopId: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  deliveryFee?: number;
  tax?: number;
  discount?: number;
  total: number;
  paymentMethod?: string;
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  deliveryAddress?: Address;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  estimatedDeliveryTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id?: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
  subtotal: number;
  notes?: string;
}

export interface Address {
  street: string;
  city: string;
  state?: string;
  zipCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

export interface DashboardStats {
  totalRevenue: number;
  todayRevenue: number;
  totalOrders: number;
  todayOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  averageOrderValue: number;
  topProducts?: Array<{
    productId: string;
    productName: string;
    totalSold: number;
    revenue: number;
  }>;
  recentOrders?: Order[];
  revenueChart?: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

export interface UserProfile {
  user: User;
  shop?: Shop;
  stats?: {
    totalOrders?: number;
    totalSpent?: number;
    completedOrders?: number;
  };
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

// Shop API Types
export interface GetDashboardResponse {
  stats: DashboardStats;
}

export interface GetShopResponse {
  shop: Shop;
}

export interface GetShopOrdersParams {
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
}

export interface GetShopOrdersResponse {
  orders: Order[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// User API Types
export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
}

// Order API Types
export interface GetOrdersParams {
  status?: string;
  page?: number;
  limit?: number;
}

export interface GetOrdersResponse {
  orders: Order[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetOrderResponse {
  order: Order;
}

// Error Response
export interface ApiError {
  status: 'error';
  message: string;
  errors?: any;
}
