import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileScreen() {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: logout 
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <LinearGradient
        colors={["#f97316", "#fb923c"]}
        style={{ paddingTop: 60, paddingBottom: 30, paddingHorizontal: 20 }}
      >
        <View className="items-center">
          <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mb-4">
            <Ionicons name="person" size={40} color="white" />
          </View>
          <Text className="text-white text-xl font-bold">
            {user?.shopName || 'KPM Partner Store'}
          </Text>
          <Text className="text-orange-100 text-sm">
            {user?.phone || '+91 98765 43210'}
          </Text>
        </View>
      </LinearGradient>

      {/* Profile Options */}
      <View className="flex-1 px-4 py-6">
        <View className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <Text className="text-gray-800 font-semibold text-lg mb-4">Account</Text>
          
          <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100">
            <Ionicons name="business" size={20} color="#f97316" />
            <Text className="flex-1 ml-3 text-gray-700">Shop Details</Text>
            <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100">
            <Ionicons name="settings" size={20} color="#f97316" />
            <Text className="flex-1 ml-3 text-gray-700">Settings</Text>
            <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center py-3">
            <Ionicons name="help-circle" size={20} color="#f97316" />
            <Text className="flex-1 ml-3 text-gray-700">Help & Support</Text>
            <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-white rounded-2xl shadow-sm p-4"
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="log-out" size={20} color="#ef4444" />
            <Text className="ml-2 text-red-500 font-semibold">Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}