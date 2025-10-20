import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StatusBar, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withSequence,
  interpolate 
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardScreen({ onNavigateToSettings }) {
  const insets = useSafeAreaInsets();
  const { user, shop } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const quickActions = [
    { title: 'Store', icon: 'storefront-outline', color: '#f97316' },
    { title: 'Inventory', icon: 'cube-outline', color: '#f97316' },
    { title: 'Invoices', icon: 'receipt-outline', color: '#f97316' },
    { title: 'Support', icon: 'headset-outline', color: '#f97316' },
  ];

  const allOrders = [
    // Pending Orders
    {
      id: 'KPM 662534',
      items: [
        { name: 'Lemon', quantity: '2kg', price: 48, image: '🍋' },
        { name: 'Mint', quantity: '100g', price: 12, image: '🌿' }
      ],
      totalPrice: 60,
      time: '5 min ago',
      status: 'pending',
      customer: 'John Doe',
      address: '123 Main St, Kottayam'
    },
    {
      id: 'KPM 662535',
      items: [
        { name: 'Tomato', quantity: '1kg', price: 35, image: '🍅' }
      ],
      totalPrice: 35,
      time: '8 min ago',
      status: 'pending',
      customer: 'Sarah Wilson',
      address: '456 Oak Ave, Kottayam'
    },
    {
      id: 'KPM 662536',
      items: [
        { name: 'Onion', quantity: '3kg', price: 90, image: '🧅' },
        { name: 'Garlic', quantity: '500g', price: 45, image: '🧄' },
        { name: 'Ginger', quantity: '200g', price: 25, image: '🫚' }
      ],
      totalPrice: 160,
      time: '12 min ago',
      status: 'pending',
      customer: 'Mike Johnson',
      address: '789 Pine Rd, Kottayam'
    },
    // Delivering Orders
    {
      id: 'KPM 662530',
      items: [
        { name: 'Banana', quantity: '1kg', price: 60, image: '🍌' },
        { name: 'Apple', quantity: '500g', price: 80, image: '🍎' }
      ],
      totalPrice: 140,
      time: '25 min ago',
      status: 'delivering',
      rider: 'Raj Kumar',
      customer: 'Emma Davis',
      address: '321 Elm St, Kottayam'
    },
    {
      id: 'KPM 662529',
      items: [
        { name: 'Carrot', quantity: '2kg', price: 120, image: '🥕' },
        { name: 'Beetroot', quantity: '1kg', price: 60, image: '🫐' },
        { name: 'Radish', quantity: '500g', price: 30, image: '🥬' },
        { name: 'Spinach', quantity: '250g', price: 25, image: '🥬' }
      ],
      totalPrice: 235,
      time: '35 min ago',
      status: 'delivering',
      rider: 'Anish Mehta',
      customer: 'David Brown',
      address: '654 Cedar Ln, Kottayam'
    },
    // Delivered Orders
    {
      id: 'KPM 662525',
      items: [
        { name: 'Potato', quantity: '2kg', price: 75, image: '🥔' }
      ],
      totalPrice: 75,
      time: '1 hour ago',
      status: 'delivered',
      customer: 'Lisa Chen',
      address: '987 Birch Dr, Kottayam'
    },
    // Cancelled Orders
    {
      id: 'KPM 662515',
      items: [
        { name: 'Mango', quantity: '1kg', price: 120, image: '🥭' }
      ],
      totalPrice: 120,
      time: '3 hours ago',
      status: 'cancelled',
      reason: 'Customer unavailable',
      customer: 'Tom Wilson',
      address: '159 Maple St, Kottayam'
    },
    // Refunded Orders
    {
      id: 'KPM 662505',
      items: [
        { name: 'Grapes', quantity: '1kg', price: 150, image: '🍇' }
      ],
      totalPrice: 150,
      time: '5 hours ago',
      status: 'refunded',
      reason: 'Quality issue',
      customer: 'Anna Smith',
      address: '753 Spruce Ave, Kottayam'
    }
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

  const handleOrderPress = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return {
          color: '#f97316',
          bgColor: '#fff7ed',
          label: 'Awaiting',
          icon: 'hourglass-outline',
          intensity: 'high'
        };
      case 'delivering':
        return {
          color: '#ea580c',
          bgColor: '#ffedd5',
          label: 'En Route',
          icon: 'rocket-outline',
          intensity: 'active'
        };
      case 'delivered':
        return {
          color: '#9a3412',
          bgColor: '#fef3c7',
          label: 'Complete',
          icon: 'checkmark-done-outline',
          intensity: 'done'
        };
      case 'cancelled':
        return {
          color: '#7c2d12',
          bgColor: '#fef3c7',
          label: 'Void',
          icon: 'ban-outline',
          intensity: 'low'
        };
      case 'refunded':
        return {
          color: '#c2410c',
          bgColor: '#fed7aa',
          label: 'Returned',
          icon: 'return-up-back-outline',
          intensity: 'medium'
        };
      default:
        return {
          color: '#f97316',
          bgColor: '#fff7ed',
          label: 'Processing',
          icon: 'sync-outline',
          intensity: 'medium'
        };
    }
  };

  // Skeleton animation for delivering orders
  const SkeletonCard = ({ children }) => {
    const skeletonOpacity = useSharedValue(0.3);

    useEffect(() => {
      skeletonOpacity.value = withRepeat(
        withSequence(
          withTiming(0.7, { duration: 800 }),
          withTiming(0.3, { duration: 800 })
        ),
        -1,
        false
      );
    }, []);

    const skeletonStyle = useAnimatedStyle(() => ({
      opacity: skeletonOpacity.value,
    }));

    return (
      <View className="relative">
        <Animated.View 
          style={[skeletonStyle]}
          className="absolute inset-0 bg-orange-100 rounded-2xl"
        />
        {children}
      </View>
    );
  };

  const StatusIndicator = ({ status, children }) => {
    const pulseScale = useSharedValue(1);
    const pulseOpacity = useSharedValue(1);

    useEffect(() => {
      if (status === 'delivering') {
        pulseScale.value = withRepeat(
          withSequence(
            withTiming(1.05, { duration: 1000 }),
            withTiming(1, { duration: 1000 })
          ),
          -1,
          false
        );
        
        pulseOpacity.value = withRepeat(
          withSequence(
            withTiming(0.7, { duration: 1000 }),
            withTiming(1, { duration: 1000 })
          ),
          -1,
          false
        );
      }
    }, [status]);

    const pulseStyle = useAnimatedStyle(() => ({
      transform: [{ scale: pulseScale.value }],
      opacity: pulseOpacity.value,
    }));

    if (status === 'delivering') {
      return (
        <View className="relative">
          <Animated.View 
            style={[pulseStyle]}
            className="absolute -inset-1 bg-orange-200 rounded-full"
          />
          {children}
        </View>
      );
    }

    return children;
  };

  const ProgressDots = ({ status }) => {
    const dot1 = useSharedValue(0);
    const dot2 = useSharedValue(0);
    const dot3 = useSharedValue(0);

    useEffect(() => {
      if (status === 'delivering') {
        const animateDots = () => {
          dot1.value = withSequence(
            withTiming(1, { duration: 300 }),
            withTiming(0.3, { duration: 300 })
          );
          setTimeout(() => {
            dot2.value = withSequence(
              withTiming(1, { duration: 300 }),
              withTiming(0.3, { duration: 300 })
            );
          }, 200);
          setTimeout(() => {
            dot3.value = withSequence(
              withTiming(1, { duration: 300 }),
              withTiming(0.3, { duration: 300 })
            );
          }, 400);
        };

        animateDots();
        const interval = setInterval(animateDots, 1200);
        return () => clearInterval(interval);
      }
    }, [status]);

    if (status !== 'delivering') return null;

    const dotStyle1 = useAnimatedStyle(() => ({ opacity: dot1.value }));
    const dotStyle2 = useAnimatedStyle(() => ({ opacity: dot2.value }));
    const dotStyle3 = useAnimatedStyle(() => ({ opacity: dot3.value }));

    return (
      <View className="flex-row items-center ml-2">
        <Animated.View style={[dotStyle1]} className="w-1 h-1 bg-orange-500 rounded-full mr-1" />
        <Animated.View style={[dotStyle2]} className="w-1 h-1 bg-orange-500 rounded-full mr-1" />
        <Animated.View style={[dotStyle3]} className="w-1 h-1 bg-orange-500 rounded-full" />
      </View>
    );
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
                {shop?.name || 'My Shop'}
              </Text>
              <View className="bg-orange-100 px-2 py-1 rounded-full flex-row items-center">
                <Ionicons name="diamond" size={10} color="#ea580c" />
                <Text className="text-orange-600 text-xs font-medium ml-1">Gold</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="location-outline" size={14} color="#9ca3af" />
              <Text className="text-gray-500 text-sm ml-1">
                {shop?.address || 'Location not set'}
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            className="w-10 h-10 items-center justify-center"
            onPress={onNavigateToSettings}
            activeOpacity={0.7}
          >
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

        {/* All Orders */}
        <View className="px-5">
          <Text className="text-gray-900 text-lg font-semibold mb-4">Recent Orders....</Text>
          
          {allOrders.map((order, index) => {
            const statusConfig = getStatusConfig(order.status);
            const firstItem = order.items[0];
            const totalItems = order.items.length;
            
            const CardWrapper = order.status === 'delivering' ? SkeletonCard : View;
            
            return (
              <CardWrapper key={order.id}>
                <TouchableOpacity 
                  className="bg-white rounded-2xl p-4 mb-3 shadow-sm relative"
                  activeOpacity={0.7}
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.08,
                    shadowRadius: 8,
                    elevation: 3,
                  }}
                  onPress={() => handleOrderPress(order)}
                >
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center">
                    <Text className="text-gray-900 font-semibold text-base mr-3">{order.id}</Text>
                    <StatusIndicator status={order.status}>
                      <View 
                        className="px-3 py-1.5 rounded-full flex-row items-center"
                        style={{ backgroundColor: statusConfig.bgColor }}
                      >
                        <Ionicons 
                          name={statusConfig.icon as any} 
                          size={12} 
                          color={statusConfig.color}
                        />
                        <Text 
                          className="text-xs font-medium ml-1.5"
                          style={{ color: statusConfig.color }}
                        >
                          {statusConfig.label}
                        </Text>
                        <ProgressDots status={order.status} />
                      </View>
                    </StatusIndicator>
                  </View>
                  <Text className="text-gray-400 text-sm">{order.time}</Text>
                </View>
                
                <View className="flex-row items-center mb-4">
                  <View className="w-12 h-12 bg-yellow-50 rounded-xl items-center justify-center mr-3">
                    <Text className="text-2xl">{firstItem.image}</Text>
                  </View>
                  <View className="flex-1 mr-3">
                    <View className="flex-row items-center flex-wrap">
                      <Text className="text-gray-900 font-semibold text-base mr-1">
                        {firstItem.name}
                      </Text>
                      {totalItems > 1 && (
                        <Text className="text-orange-600 text-sm">+{totalItems - 1} more</Text>
                      )}
                    </View>
                    <Text className="text-gray-500 text-sm mt-0.5">{firstItem.quantity}</Text>
                    {order.rider && (
                      <Text className="text-orange-600 text-xs mt-1">Rider: {order.rider}</Text>
                    )}
                    {order.reason && (
                      <Text className="text-gray-500 text-xs mt-1">{order.reason}</Text>
                    )}
                  </View>
                  <Text className="text-gray-900 font-bold text-lg">₹ {order.totalPrice}</Text>
                </View>
                
                {order.status === 'pending' && (
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
                )}

                {order.status === 'delivering' && (
                  <View className="mt-3">
                    <View className="bg-orange-50 p-3 rounded-xl mb-3">
                      <Text className="text-orange-700 text-sm font-medium mb-1">
                        Delivery in Progress
                      </Text>
                      <Text className="text-orange-600 text-xs">
                        Rider: {order.rider}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <TouchableOpacity 
                        className="bg-orange-500 px-6 py-3 rounded-xl flex-1"
                        activeOpacity={0.8}
                        style={{ marginRight: 12 }}
                      >
                        <Text className="text-white font-semibold text-center">Track Order</Text>
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
                )}

                {(order.status === 'delivered' || order.status === 'cancelled' || order.status === 'refunded') && (
                  <View className="mt-3 flex-row justify-between items-center">
                    <View className="flex-1">
                      {order.status === 'delivered' && (
                        <Text className="text-gray-600 text-sm">
                          Successfully completed
                        </Text>
                      )}
                      {order.status === 'cancelled' && (
                        <Text className="text-gray-600 text-sm">
                          {order.reason}
                        </Text>
                      )}
                      {order.status === 'refunded' && (
                        <Text className="text-gray-600 text-sm">
                          Refunded - {order.reason}
                        </Text>
                      )}
                    </View>
                    <TouchableOpacity 
                      className="w-12 h-12 bg-gray-100 rounded-xl items-center justify-center"
                      activeOpacity={0.7}
                      onPress={() => handleOptionsPress(order.id)}
                    >
                      <Ionicons name="ellipsis-horizontal" size={20} color="#6b7280" />
                    </TouchableOpacity>
                  </View>
                )}
                </TouchableOpacity>
              </CardWrapper>
            );
          })}
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

      {/* Order Details Bottom Sheet */}
      <Modal
        visible={showOrderDetails}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowOrderDetails(false)}
      >
        <TouchableOpacity 
          className="flex-1 bg-black/50 justify-end"
          activeOpacity={1}
          onPress={() => setShowOrderDetails(false)}
        >
          <View className="bg-white rounded-t-3xl max-h-[80%]">
            <View className="w-12 h-1 bg-gray-300 rounded-full self-center my-3" />
            
            {selectedOrder && (
              <ScrollView className="px-6 pb-6" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="flex-row items-center justify-between mb-6">
                  <View>
                    <Text className="text-gray-900 text-xl font-bold">{selectedOrder.id}</Text>
                    <Text className="text-gray-500 text-sm">{selectedOrder.time}</Text>
                  </View>
                  <View 
                    className="px-3 py-1.5 rounded-full flex-row items-center"
                    style={{ backgroundColor: getStatusConfig(selectedOrder.status).bgColor }}
                  >
                    <Ionicons 
                      name={getStatusConfig(selectedOrder.status).icon as any} 
                      size={14} 
                      color={getStatusConfig(selectedOrder.status).color}
                    />
                    <Text 
                      className="text-xs font-medium ml-1.5"
                      style={{ color: getStatusConfig(selectedOrder.status).color }}
                    >
                      {getStatusConfig(selectedOrder.status).label}
                    </Text>
                  </View>
                </View>

                {/* Customer Info */}
                <View className="bg-gray-50 rounded-xl p-4 mb-6">
                  <Text className="text-gray-900 font-semibold text-base mb-2">Customer Details</Text>
                  <Text className="text-gray-700 font-medium">{selectedOrder.customer}</Text>
                  <Text className="text-gray-500 text-sm mt-1">{selectedOrder.address}</Text>
                  {selectedOrder.rider && (
                    <Text className="text-orange-600 text-sm mt-2">Rider: {selectedOrder.rider}</Text>
                  )}
                </View>

                {/* Items List */}
                <View className="mb-6">
                  <Text className="text-gray-900 font-semibold text-base mb-4">Order Items</Text>
                  {selectedOrder.items.map((item, index) => (
                    <View key={index} className="flex-row items-center py-3 border-b border-gray-100">
                      <View className="w-12 h-12 bg-yellow-50 rounded-xl items-center justify-center mr-3">
                        <Text className="text-2xl">{item.image}</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-gray-900 font-medium">{item.name}</Text>
                        <Text className="text-gray-500 text-sm">{item.quantity}</Text>
                      </View>
                      <Text className="text-gray-900 font-semibold">₹ {item.price}</Text>
                    </View>
                  ))}
                </View>

                {/* Total */}
                <View className="bg-orange-50 rounded-xl p-4 mb-6">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-gray-900 font-semibold text-lg">Total Amount</Text>
                    <Text className="text-orange-600 font-bold text-xl">₹ {selectedOrder.totalPrice}</Text>
                  </View>
                  <Text className="text-gray-500 text-sm mt-1">{selectedOrder.items.length} items</Text>
                </View>

                {/* Action Buttons */}
                {selectedOrder.status === 'pending' && (
                  <View className="flex-row space-x-3">
                    <TouchableOpacity 
                      className="bg-gray-200 px-6 py-3 rounded-xl flex-1"
                      activeOpacity={0.8}
                    >
                      <Text className="text-gray-700 font-semibold text-center">Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      className="bg-orange-500 px-6 py-3 rounded-xl flex-1"
                      activeOpacity={0.8}
                    >
                      <Text className="text-white font-semibold text-center">Accept Order</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {selectedOrder.status === 'delivering' && (
                  <TouchableOpacity 
                    className="bg-orange-500 px-6 py-3 rounded-xl"
                    activeOpacity={0.8}
                  >
                    <Text className="text-white font-semibold text-center">Track Live Location</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}