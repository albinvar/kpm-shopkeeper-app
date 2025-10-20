import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, Switch, StatusBar, ActivityIndicator, BackHandler } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation, router } from 'expo-router';

export default function SettingsScreen({ onBack }) {
  const { logout, user, shop } = useAuth();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState(true);
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [autoAccept, setAutoAccept] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Handle back button - navigate to home tab instead of exit
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      try {
        // Navigate to home tab
        navigation.navigate('index' as never);
        return true; // Prevent default behavior
      } catch (error) {
        console.error('Navigation error:', error);
        return false; // Allow default behavior if navigation fails
      }
    });

    return () => backHandler.remove();
  }, [navigation]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout from your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
              setIsLoggingOut(false);
            }
          }
        },
      ]
    );
  };

  const handleNavigate = (route: string) => {
    if (route) {
      router.push(route as any);
    }
  };

  const settingsSections = [
    {
      title: 'Account & Shop',
      items: [
        { icon: 'storefront-outline', title: 'Shop Profile', subtitle: 'Edit shop details and information', action: 'navigate', route: '/shop-profile' },
        { icon: 'business-outline', title: 'Business Information', subtitle: 'Tax details, licenses, documents', action: 'navigate', route: '/contact-info' },
        { icon: 'card-outline', title: 'Payment Settings', subtitle: 'Bank account, payment methods', action: 'navigate', route: '' },
        { icon: 'time-outline', title: 'Operating Hours', subtitle: 'Set your shop timing', action: 'navigate', route: '/operating-hours' },
      ]
    },
    {
      title: 'Orders & Delivery',
      items: [
        { icon: 'bicycle-outline', title: 'Delivery Settings', subtitle: 'Radius, charges, delivery partners', action: 'navigate' },
        { icon: 'list-outline', title: 'Order Management', subtitle: 'Auto-accept, preparation time', action: 'navigate' },
        { icon: 'pricetag-outline', title: 'Pricing & Offers', subtitle: 'Discounts, promotions, pricing', action: 'navigate' },
        { icon: 'analytics-outline', title: 'Sales Reports', subtitle: 'View detailed sales analytics', action: 'navigate' },
      ]
    },
    {
      title: 'Notifications',
      items: [
        { icon: 'notifications-outline', title: 'Push Notifications', subtitle: 'General app notifications', action: 'toggle', value: notifications, setter: setNotifications },
        { icon: 'alert-circle-outline', title: 'Order Alerts', subtitle: 'New order sound notifications', action: 'toggle', value: orderAlerts, setter: setOrderAlerts },
        { icon: 'checkmark-circle-outline', title: 'Auto Accept Orders', subtitle: 'Automatically accept new orders', action: 'toggle', value: autoAccept, setter: setAutoAccept },
      ]
    },
    {
      title: 'App Settings',
      items: [
        { icon: 'language-outline', title: 'Language', subtitle: 'English', action: 'navigate' },
        { icon: 'moon-outline', title: 'Dark Mode', subtitle: 'Toggle dark theme', action: 'toggle', value: darkMode, setter: setDarkMode },
        { icon: 'cloud-download-outline', title: 'Data Backup', subtitle: 'Backup your shop data', action: 'navigate' },
        { icon: 'refresh-outline', title: 'App Version', subtitle: 'v1.2.4 - Check for updates', action: 'navigate' },
      ]
    },
    {
      title: 'Support & Legal',
      items: [
        { icon: 'help-circle-outline', title: 'Help & Support', subtitle: 'FAQs, contact support', action: 'navigate' },
        { icon: 'chatbubble-outline', title: 'Feedback', subtitle: 'Send feedback and suggestions', action: 'navigate' },
        { icon: 'document-text-outline', title: 'Terms & Conditions', subtitle: 'Read terms of service', action: 'navigate' },
        { icon: 'shield-checkmark-outline', title: 'Privacy Policy', subtitle: 'How we protect your data', action: 'navigate' },
      ]
    }
  ];

  const renderSettingItem = (item, isLast = false) => (
    <TouchableOpacity
      key={item.title}
      className={`flex-row items-center py-4 ${!isLast ? 'border-b border-gray-100' : ''}`}
      activeOpacity={0.7}
      onPress={() => item.route && handleNavigate(item.route)}
      disabled={!item.route && item.action === 'navigate'}
    >
      <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center mr-4">
        <Ionicons name={item.icon as any} size={20} color="#f97316" />
      </View>
      <View className="flex-1">
        <Text className="text-gray-900 font-medium text-base">{item.title}</Text>
        <Text className="text-gray-500 text-sm mt-0.5">{item.subtitle}</Text>
      </View>
      {item.action === 'toggle' ? (
        <Switch
          value={item.value}
          onValueChange={item.setter}
          trackColor={{ false: '#f3f4f6', true: '#fed7aa' }}
          thumbColor={item.value ? '#f97316' : '#ffffff'}
          ios_backgroundColor="#f3f4f6"
        />
      ) : (
        <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
      )}
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" translucent={false} />
      
      {/* Header */}
      <View 
        className="bg-white px-5 pb-4 border-b border-gray-100"
        style={{ paddingTop: insets.top + 16 }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            {onBack && (
              <TouchableOpacity 
                className="w-10 h-10 items-center justify-center mr-3"
                onPress={onBack}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={24} color="#374151" />
              </TouchableOpacity>
            )}
            <View className="flex-1">
              <Text className="text-gray-900 text-2xl font-bold">Settings</Text>
              <Text className="text-gray-500 text-sm mt-1">Manage your shop preferences</Text>
            </View>
          </View>
          <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center">
            <Ionicons name="settings" size={24} color="#f97316" />
          </View>
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}
      >
        {/* Shop Info Card */}
        <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
          <View className="flex-row items-center">
            <View className="w-16 h-16 bg-orange-100 rounded-2xl items-center justify-center mr-4">
              <Ionicons name="storefront" size={28} color="#f97316" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-900 font-bold text-lg">
                {shop?.businessName || 'My Shop'}
              </Text>
              {shop?.contactInfo?.phone && (
                <View className="flex-row items-center mt-1">
                  <Ionicons name="call-outline" size={12} color="#6b7280" />
                  <Text className="text-gray-500 text-sm ml-1">
                    {shop.contactInfo.phone}
                  </Text>
                </View>
              )}
              {shop?.address && (
                <View className="flex-row items-center mt-1">
                  <Ionicons name="location-outline" size={12} color="#6b7280" />
                  <Text className="text-gray-500 text-sm ml-1" numberOfLines={1}>
                    {shop.address.city && shop.address.state
                      ? `${shop.address.addressLine1 || ''}, ${shop.address.city}, ${shop.address.state}`.replace(/^,\s*/, '')
                      : shop.address.addressLine1 || 'Address not set'}
                  </Text>
                </View>
              )}
              <View className="flex-row items-center mt-1">
                <View className={`w-2 h-2 rounded-full mr-2 ${shop?.isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
                <Text className={`text-xs font-medium ${shop?.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                  {shop?.isOpen ? 'Open' : 'Closed'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
              onPress={() => handleNavigate('/shop-profile')}
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={16} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={section.title} className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <Text className="text-gray-900 font-bold text-base mb-4">{section.title}</Text>
            {section.items.map((item, itemIndex) => 
              renderSettingItem(item, itemIndex === section.items.length - 1)
            )}
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-white rounded-2xl shadow-sm p-4 mb-4"
          activeOpacity={0.8}
          disabled={isLoggingOut}
        >
          <View className="flex-row items-center justify-center">
            {isLoggingOut ? (
              <ActivityIndicator size="small" color="#ef4444" />
            ) : (
              <>
                <Ionicons name="log-out-outline" size={24} color="#ef4444" />
                <Text className="ml-3 text-red-500 font-semibold text-lg">Logout</Text>
              </>
            )}
          </View>
        </TouchableOpacity>

        {/* App Info */}
        <View className="items-center py-4">
          <Text className="text-gray-400 text-sm">KPM Partner v1.2.4</Text>
          <Text className="text-gray-400 text-xs mt-1">Made with ❤️ for local businesses</Text>
        </View>
      </ScrollView>
    </View>
  );
}