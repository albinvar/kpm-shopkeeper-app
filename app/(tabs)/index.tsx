import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StatusBar, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const quickActions = [
    { title: 'Store', icon: 'storefront-outline', color: '#f97316' },
    { title: 'Inventory', icon: 'cube-outline', color: '#f97316' },
    { title: 'Invoices', icon: 'receipt-outline', color: '#f97316' },
    { title: 'Support', icon: 'headset-outline', color: '#f97316' },
  ];

  const pendingOrders = [
    {
      id: 'KPM 662534',
      item: 'Lemon',
      quantity: '2kg',
      price: 48,
      time: '5 min ago',
      image: '🍋'
    },
    {
      id: 'KPM 662535',
      item: 'Tomato',
      quantity: '1kg',
      price: 35,
      time: '8 min ago',
      image: '🍅'
    },
    {
      id: 'KPM 662536',
      item: 'Onion',
      quantity: '3kg',
      price: 90,
      time: '12 min ago',
      image: '🧅'
    },
  ];

  const orderOptions = [
    { id: 'view', title: 'View Details', icon: 'eye-outline' },
    { id: 'edit', title: 'Edit Order', icon: 'create-outline' },
    { id: 'cancel', title: 'Cancel Order', icon: 'close-circle-outline', color: '#ef4444' },
    { id: 'contact', title: 'Contact Customer', icon: 'call-outline' },
  ];

  const handleOptionsPress = (orderId) => {
    setSelectedOrderId(orderId);
    setShowOptionsModal(true);
  };

  const handleOptionSelect = (option) => {
    console.log(`Selected ${option.title} for order ${selectedOrderId}`);
    setShowOptionsModal(false);
    setSelectedOrderId(null);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" translucent={false} />
      
      {/* Header */}
      <View 
        className="bg-white px-5 pb-4"
        style={{ paddingTop: insets.top + 16 }}
      >
        <View className="flex-row items-center justify-between mb-1">
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <Text className="text-gray-900 text-lg font-semibold mr-2">
                {user?.shopName || 'Madhav Stores'}
              </Text>
              <View className="bg-orange-100 px-2 py-1 rounded-full flex-row items-center">
                <Ionicons name="diamond" size={10} color="#ea580c" />
                <Text className="text-orange-600 text-xs font-medium ml-1">Gold</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="location-outline" size={14} color="#9ca3af" />
              <Text className="text-gray-500 text-sm ml-1">Kottayam, Kerala</Text>
            </View>
          </View>
          <TouchableOpacity className="w-10 h-10 items-center justify-center">
            <Ionicons name="settings-outline" size={24} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Monthly Income Card */}
        <View className="px-5 mb-6">
          <View className="bg-orange-500 rounded-3xl p-6 relative overflow-hidden">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-white text-base font-medium">Your Monthly Income is</Text>
              <TouchableOpacity className="bg-white/20 px-3 py-1.5 rounded-lg flex-row items-center">
                <Ionicons name="stats-chart-outline" size={16} color="white" />
                <Text className="text-white text-sm font-medium ml-1">Statistic</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-white text-3xl font-bold">₹ 17,269.12</Text>
            
            {/* Decorative circles */}
            <View className="absolute -right-8 -top-8 w-20 h-20 bg-white/10 rounded-full" />
            <View className="absolute -right-4 top-12 w-12 h-12 bg-white/15 rounded-full" />
          </View>
        </View>

        {/* Search Bar */}
        <View className="px-5 mb-6">
          <View className="bg-white rounded-2xl px-4 py-2 flex-row items-center shadow-sm">
            <Ionicons name="search-outline" size={20} color="#9ca3af" />
            <TextInput
              className="flex-1 ml-3 text-gray-700 text-base"
              placeholder="Search product..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity className="ml-2">
              <Ionicons name="options-outline" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-5 mb-6">
          <View className="flex-row justify-between">
            {quickActions.map((action, index) => (
              <TouchableOpacity 
                key={action.title}
                className="bg-white rounded-2xl p-4 items-center shadow-sm"
                style={{ width: '22%' }}
                activeOpacity={0.7}
              >
                <View className="w-12 h-12 bg-orange-50 rounded-xl items-center justify-center mb-2">
                  <Ionicons name={action.icon as any} size={24} color={action.color} />
                </View>
                <Text className="text-gray-700 text-xs font-medium text-center">
                  {action.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Pending Orders */}
        <View className="px-5">
          <Text className="text-gray-900 text-lg font-semibold mb-4">Pending Orders....</Text>
          
          {pendingOrders.map((order, index) => (
            <TouchableOpacity 
              key={order.id}
              className="bg-white rounded-2xl p-4 mb-3 shadow-sm"
              activeOpacity={0.7}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-gray-900 font-semibold text-base">{order.id}</Text>
                <Text className="text-gray-400 text-sm">{order.time}</Text>
              </View>
              
              <View className="flex-row items-center mb-4">
                <View className="w-12 h-12 bg-yellow-50 rounded-xl items-center justify-center mr-3">
                  <Text className="text-2xl">{order.image}</Text>
                </View>
                <View className="flex-1 mr-3">
                  <View className="flex-row items-center flex-wrap">
                    <Text className="text-gray-900 font-semibold text-base mr-1">
                      {order.item}
                    </Text>
                    <Text className="text-gray-600 text-sm">(x2)</Text>
                  </View>
                  <Text className="text-gray-500 text-sm mt-0.5">{order.quantity}</Text>
                </View>
                <Text className="text-gray-900 font-bold text-lg">₹ {order.price}</Text>
              </View>
              
              <View className="mt-3">
                <Text className="text-gray-400 text-sm mb-3">
                  Mark the order as ready to be delivered
                </Text>
                <View className="flex-row items-center">
                  <TouchableOpacity 
                    className="bg-orange-500 px-6 py-3 rounded-xl flex-1"
                    activeOpacity={0.8}
                    style={{ marginRight: 12 }}
                  >
                    <Text className="text-white font-semibold text-center">Confirm Order</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="w-12 h-12 bg-gray-100 rounded-xl items-center justify-center"
                    activeOpacity={0.7}
                    onPress={() => handleOptionsPress(order.id)}
                  >
                    <Ionicons name="ellipsis-horizontal" size={20} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Options Modal */}
      <Modal
        visible={showOptionsModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowOptionsModal(false)}
      >
        <TouchableOpacity 
          className="flex-1 bg-black/50 justify-end"
          activeOpacity={1}
          onPress={() => setShowOptionsModal(false)}
        >
          <View className="bg-white rounded-t-3xl p-6">
            <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-6" />
            <Text className="text-gray-900 text-lg font-semibold mb-4 text-center">
              Order Options
            </Text>
            
            {orderOptions.map((option, index) => (
              <TouchableOpacity
                key={option.id}
                className="flex-row items-center py-4 border-b border-gray-100"
                activeOpacity={0.7}
                onPress={() => handleOptionSelect(option)}
              >
                <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-4">
                  <Ionicons 
                    name={option.icon as any} 
                    size={20} 
                    color={option.color || '#6b7280'} 
                  />
                </View>
                <Text 
                  className="flex-1 text-base font-medium"
                  style={{ color: option.color || '#374151' }}
                >
                  {option.title}
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              className="mt-4 py-3"
              onPress={() => setShowOptionsModal(false)}
            >
              <Text className="text-gray-500 text-center font-medium">Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}