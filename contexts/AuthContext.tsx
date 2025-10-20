import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';
import userService from '../services/userService';
import { User, Shop } from '../lib/api/types';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  sendOtp: (phone: string) => Promise<{ success: boolean; message: string; otp?: string }>;
  verifyOtpAndLogin: (phone: string, otp: string) => Promise<{ success: boolean; message: string }>;
  completeLogin: () => Promise<void>;
  logout: () => Promise<void>;
  user: User | null;
  shop: Shop | null;
  phoneNumber: string | null;
  setPhoneNumber: (phone: string) => void;
  pendingAuthData: { user: User; shop: Shop; token: string } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [shop, setShop] = useState<Shop | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [pendingAuthData, setPendingAuthData] = useState<{ user: User; shop: Shop; token: string } | null>(null);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userData = await AsyncStorage.getItem('userData');
      const shopData = await AsyncStorage.getItem('shopData');

      if (token && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
        if (shopData) {
          setShop(JSON.parse(shopData));
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtp = async (phone: string): Promise<{ success: boolean; message: string; otp?: string }> => {
    try {
      // Format phone to include +91 if not present
      const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone.replace(/\s/g, '')}`;

      const response = await authService.sendOtp(formattedPhone);

      if (response.status === 'success' && response.data) {
        return {
          success: true,
          message: response.message,
          otp: response.data.otp, // Will be present in dev mode
        };
      }

      return {
        success: false,
        message: response.message || 'Failed to send OTP',
      };
    } catch (error: any) {
      console.error('Send OTP error:', error);
      return {
        success: false,
        message: error.message || 'Failed to send OTP',
      };
    }
  };

  const verifyOtpAndLogin = async (phone: string, otp: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Format phone to include +91 if not present
      const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone.replace(/\s/g, '')}`;

      const response = await authService.verifyOtp(formattedPhone, otp);

      if (response.status === 'success' && response.data) {
        // Store auth data temporarily without setting authenticated state
        // This allows us to show the initializing screen first
        setPendingAuthData({
          user: response.data.user,
          shop: response.data.shop,
          token: response.data.token,
        });

        return {
          success: true,
          message: response.message || 'Login successful',
        };
      }

      return {
        success: false,
        message: response.message || 'Invalid OTP',
      };
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      return {
        success: false,
        message: error.message || 'Invalid or expired OTP',
      };
    }
  };

  const completeLogin = async () => {
    try {
      if (!pendingAuthData) {
        throw new Error('No pending authentication data');
      }

      // Debug: Log the initial minimal shop data
      console.log('🏪 Minimal Shop Data from Auth:', JSON.stringify(pendingAuthData.shop, null, 2));

      // Save token first so subsequent API calls are authenticated
      await AsyncStorage.setItem('authToken', pendingAuthData.token);

      // Fetch full user and shop details from /api/auth/me
      console.log('📡 Fetching full shop details...');
      const meResponse = await userService.getMe();

      let fullShopData = pendingAuthData.shop;

      if (meResponse.status === 'success' && meResponse.data?.shop) {
        fullShopData = meResponse.data.shop;
        console.log('✅ Full Shop Data Retrieved:', JSON.stringify(fullShopData, null, 2));
      } else {
        console.warn('⚠️ Could not fetch full shop details, using minimal data');
      }

      // Save user and full shop data to storage
      await AsyncStorage.setItem('userData', JSON.stringify(pendingAuthData.user));
      await AsyncStorage.setItem('shopData', JSON.stringify(fullShopData));

      // Update auth state with full data
      setIsAuthenticated(true);
      setUser(pendingAuthData.user);
      setShop(fullShopData);
      setPendingAuthData(null);
    } catch (error) {
      console.error('Complete login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('shopData');

      setIsAuthenticated(false);
      setUser(null);
      setShop(null);
      setPhoneNumber(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        sendOtp,
        verifyOtpAndLogin,
        completeLogin,
        logout,
        user,
        shop,
        phoneNumber,
        setPhoneNumber,
        pendingAuthData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};