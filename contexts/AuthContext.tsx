import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';
import { User, Shop } from '../lib/api/types';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  sendOtp: (phone: string) => Promise<{ success: boolean; message: string; otp?: string }>;
  verifyOtpAndLogin: (phone: string, otp: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  user: User | null;
  shop: Shop | null;
  phoneNumber: string | null;
  setPhoneNumber: (phone: string) => void;
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
        // Save token and user data
        await AsyncStorage.setItem('authToken', response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
        await AsyncStorage.setItem('shopData', JSON.stringify(response.data.shop));

        setIsAuthenticated(true);
        setUser(response.data.user);
        setShop(response.data.shop);

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
        logout,
        user,
        shop,
        phoneNumber,
        setPhoneNumber,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};