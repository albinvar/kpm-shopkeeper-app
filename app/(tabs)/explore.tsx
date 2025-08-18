import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('pending');

  const tabs = [
    { id: 'pending', title: 'Pending', count: 8 },
    { id: 'preparing', title: 'Preparing', count: 5 },
    { id: 'ready', title: 'Ready', count: 3 },
    { id: 'completed', title: 'Completed', count: 24 },
  ];

  const orders = [
    { id: 'KMP001', customer: 'John Doe', items: 3, amount: 450, time: '2 min ago', status: 'pending' },
    { id: 'KMP002', customer: 'Sarah Wilson', items: 2, amount: 320, time: '5 min ago', status: 'pending' },
    { id: 'KMP003', customer: 'Mike Johnson', items: 4, amount: 680, time: '8 min ago', status: 'preparing' },
    { id: 'KMP004', customer: 'Emma Davis', items: 1, amount: 150, time: '12 min ago', status: 'ready' },
    { id: 'KMP005', customer: 'David Brown', items: 2, amount: 290, time: '15 min ago', status: 'completed' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'preparing': return '#3b82f6';
      case 'ready': return '#10b981';
      case 'completed': return '#059669';
      default: return '#6b7280';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'pending': return '#fef3c7';
      case 'preparing': return '#dbeafe';
      case 'ready': return '#d1fae5';
      case 'completed': return '#d1fae5';
      default: return '#f3f4f6';
    }
  };

  const filteredOrders = orders.filter(order => order.status === activeTab);

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
            <Text className="text-white text-2xl font-bold">Orders</Text>
            <Text className="text-orange-100 text-sm">Manage your incoming orders</Text>
          </View>
          <TouchableOpacity className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
            <Ionicons name="notifications-outline" size={20} color="white" />
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>

      {/* Tabs */}
      <Animated.View 
        entering={FadeInUp.delay(400).duration(800)}
        className="bg-white border-b border-gray-200"
      >
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="px-4 py-3"
        >
          {tabs.map((tab, index) => (
            <Animated.View key={tab.id} entering={FadeInUp.delay(600 + index * 100).duration(600)}>
              <TouchableOpacity
                onPress={() => setActiveTab(tab.id)}
                className={`mr-4 px-4 py-2 rounded-full flex-row items-center ${
                  activeTab === tab.id 
                    ? 'bg-orange-500' 
                    : 'bg-gray-100'
                }`}
              >
                <Text className={`font-semibold ${
                  activeTab === tab.id ? 'text-white' : 'text-gray-600'
                }`}>
                  {tab.title}
                </Text>
                <View className={`ml-2 w-6 h-6 rounded-full items-center justify-center ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-orange-500'
                }`}>
                  <Text className={`text-xs font-bold ${
                    activeTab === tab.id ? 'text-white' : 'text-white'
                  }`}>
                    {tab.count}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Orders List */}
      <ScrollView 
        className="flex-1 px-4 py-4"
        showsVerticalScrollIndicator={false}
      >
        {filteredOrders.map((order, index) => (
          <Animated.View 
            key={order.id}
            entering={FadeInUp.delay(800 + index * 100).duration(600)}
            className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center mr-3">
                  <Text className="text-orange-600 font-bold">#</Text>
                </View>
                <View>
                  <Text className="text-gray-800 font-bold">Order {order.id}</Text>
                  <Text className="text-gray-500 text-sm">{order.customer}</Text>
                </View>
              </View>
              <View 
                className="px-3 py-1 rounded-full"
                style={{ backgroundColor: getStatusBg(order.status) }}
              >
                <Text 
                  className="text-xs font-semibold capitalize"
                  style={{ color: getStatusColor(order.status) }}
                >
                  {order.status}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-gray-600">{order.items} items</Text>
              <Text className="text-gray-800 font-bold">¹{order.amount}</Text>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-gray-400 text-xs">{order.time}</Text>
              <View className="flex-row space-x-2">
                {activeTab === 'pending' && (
                  <>
                    <TouchableOpacity className="bg-red-100 px-3 py-1 rounded-full">
                      <Text className="text-red-600 text-xs font-semibold">Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-green-100 px-3 py-1 rounded-full">
                      <Text className="text-green-600 text-xs font-semibold">Accept</Text>
                    </TouchableOpacity>
                  </>
                )}
                {activeTab === 'preparing' && (
                  <TouchableOpacity className="bg-blue-100 px-3 py-1 rounded-full">
                    <Text className="text-blue-600 text-xs font-semibold">Mark Ready</Text>
                  </TouchableOpacity>
                )}
                {activeTab === 'ready' && (
                  <TouchableOpacity className="bg-green-100 px-3 py-1 rounded-full">
                    <Text className="text-green-600 text-xs font-semibold">Delivered</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Animated.View>
        ))}

        {filteredOrders.length === 0 && (
          <Animated.View 
            entering={FadeInUp.delay(800).duration(800)}
            className="items-center py-12"
          >
            <Ionicons name="receipt-outline" size={64} color="#d1d5db" />
            <Text className="text-gray-400 text-lg font-medium mt-4">No {activeTab} orders</Text>
            <Text className="text-gray-400 text-sm text-center mt-2">
              Orders will appear here when customers place them
            </Text>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}