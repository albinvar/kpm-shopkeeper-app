import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const stats = [
    { title: 'Today\'s Orders', value: '24', icon: 'receipt-outline', color: '#f97316' },
    { title: 'Revenue', value: '₹12,450', icon: 'wallet-outline', color: '#10b981' },
    { title: 'Pending Orders', value: '8', icon: 'time-outline', color: '#f59e0b' },
    { title: 'Completed', value: '16', icon: 'checkmark-circle-outline', color: '#059669' },
  ];

  const quickActions = [
    { title: 'New Order', icon: 'add-circle-outline', color: '#f97316' },
    { title: 'View Menu', icon: 'restaurant-outline', color: '#8b5cf6' },
    { title: 'Delivery Status', icon: 'bicycle-outline', color: '#06b6d4' },
    { title: 'Reports', icon: 'analytics-outline', color: '#84cc16' },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <LinearGradient
        colors={["#f97316", "#fb923c"]}
        style={{ 
          paddingTop: insets.top + 20, 
          paddingBottom: 20, 
          paddingHorizontal: 20 
        }}
      >
        <Animated.View 
          entering={FadeInDown.delay(200).duration(800)}
          className="flex-row items-center justify-between"
        >
          <View>
            <Text className="text-white text-lg font-medium">Welcome back!</Text>
            <Text className="text-orange-100 text-2xl font-bold">
              {user?.shopName || 'KPM Partner Store'}
            </Text>
          </View>
          <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
            <Ionicons name="storefront" size={24} color="white" />
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView 
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Quick Stats */}
        <Animated.View 
          entering={FadeInUp.delay(400).duration(800)}
          className="bg-white rounded-2xl shadow-sm p-4 mb-6 -mt-6 mx-2"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Text className="text-gray-800 font-bold text-lg mb-4">Today's Overview</Text>
          <View className="flex-row flex-wrap">
            {stats.map((stat, index) => (
              <Animated.View 
                key={stat.title}
                entering={FadeInUp.delay(600 + index * 100).duration(600)}
                className="w-1/2 mb-4"
              >
                <View className="items-center">
                  <View 
                    className="w-12 h-12 rounded-full items-center justify-center mb-2"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                  </View>
                  <Text className="text-gray-800 font-bold text-xl">{stat.value}</Text>
                  <Text className="text-gray-500 text-sm text-center">{stat.title}</Text>
                </View>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View 
          entering={FadeInUp.delay(800).duration(800)}
          className="mb-6"
        >
          <Text className="text-gray-800 font-bold text-lg mb-4 px-2">Quick Actions</Text>
          <View className="flex-row flex-wrap justify-between">
            {quickActions.map((action, index) => (
              <Animated.View 
                key={action.title}
                entering={FadeInUp.delay(1000 + index * 100).duration(600)}
                className="w-[48%] mb-4"
              >
                <TouchableOpacity 
                  className="bg-white rounded-2xl p-4 items-center shadow-sm"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 2,
                  }}
                  activeOpacity={0.8}
                >
                  <View 
                    className="w-12 h-12 rounded-full items-center justify-center mb-3"
                    style={{ backgroundColor: `${action.color}20` }}
                  >
                    <Ionicons name={action.icon as any} size={24} color={action.color} />
                  </View>
                  <Text className="text-gray-800 font-semibold text-center">
                    {action.title}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Recent Orders */}
        <Animated.View 
          entering={FadeInUp.delay(1200).duration(800)}
          className="bg-white rounded-2xl shadow-sm p-4 mx-2"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-gray-800 font-bold text-lg">Recent Orders</Text>
            <TouchableOpacity>
              <Text className="text-orange-500 font-semibold">View All</Text>
            </TouchableOpacity>
          </View>

          {[1, 2, 3].map((order, index) => (
            <Animated.View 
              key={order}
              entering={FadeInUp.delay(1400 + index * 100).duration(600)}
              className="flex-row items-center py-3 border-b border-gray-100 last:border-b-0"
            >
              <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center mr-3">
                <Text className="text-orange-600 font-bold">#{order}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 font-semibold">Order #KMP00{order}24</Text>
                <Text className="text-gray-500 text-sm">2 items • ₹{450 + order * 50}</Text>
              </View>
              <View className="items-end">
                <View className="bg-green-100 px-2 py-1 rounded-full">
                  <Text className="text-green-600 text-xs font-semibold">Completed</Text>
                </View>
                <Text className="text-gray-400 text-xs mt-1">2 min ago</Text>
              </View>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Shop Status */}
        <Animated.View 
          entering={FadeInUp.delay(1600).duration(800)}
          className="bg-white rounded-2xl shadow-sm p-4 mx-2 mt-6"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-gray-800 font-bold text-lg">Shop Status</Text>
              <Text className="text-gray-500 text-sm">Currently accepting orders</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-3 h-3 bg-green-500 rounded-full mr-2"></View>
              <Text className="text-green-600 font-semibold">Open</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}