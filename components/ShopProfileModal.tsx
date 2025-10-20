import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import shopService from '../services/shopService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ShopProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ShopProfileModal({ visible, onClose }: ShopProfileModalProps) {
  const insets = useSafeAreaInsets();
  const { shop, setShop } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [businessType, setBusinessType] = useState<string>('shop');

  const businessTypes = [
    { value: 'restaurant', label: 'Restaurant', icon: 'restaurant-outline' },
    { value: 'shop', label: 'Shop', icon: 'storefront-outline' },
    { value: 'firm', label: 'Firm', icon: 'business-outline' },
    { value: 'grocery', label: 'Grocery', icon: 'cart-outline' },
    { value: 'pharmacy', label: 'Pharmacy', icon: 'medical-outline' },
    { value: 'electronics', label: 'Electronics', icon: 'phone-portrait-outline' },
    { value: 'clothing', label: 'Clothing', icon: 'shirt-outline' },
    { value: 'other', label: 'Other', icon: 'ellipsis-horizontal-outline' },
  ];

  useEffect(() => {
    if (shop && visible) {
      setBusinessName(shop.businessName || '');
      setDescription(shop.description || '');
      setBusinessType(shop.businessType || 'shop');
    }
  }, [shop, visible]);

  const handleSave = async () => {
    if (!shop?.id) {
      Alert.alert('Error', 'Shop information not available');
      return;
    }

    if (!businessName.trim()) {
      Alert.alert('Validation Error', 'Business name is required');
      return;
    }

    try {
      setIsSaving(true);
      const response = await shopService.updateBasicInfo(shop.id, {
        businessName: businessName.trim(),
        description: description.trim() || undefined,
        businessType: businessType as any,
      });

      if (response.status === 'success' && response.data) {
        const updatedShop = { ...shop, ...response.data.shop };
        setShop(updatedShop);
        await AsyncStorage.setItem('shopData', JSON.stringify(updatedShop));

        Alert.alert('Success', 'Shop profile updated successfully');
        onClose();
      }
    } catch (error: any) {
      console.error('Save error:', error);
      Alert.alert('Error', error.message || 'Failed to update shop profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-gray-50">
        <View
          className="bg-white px-5 pb-4 border-b border-gray-100"
          style={{ paddingTop: insets.top + 16 }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <TouchableOpacity
                className="w-10 h-10 items-center justify-center mr-3"
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
              <View className="flex-1">
                <Text className="text-gray-900 text-2xl font-bold">Shop Profile</Text>
                <Text className="text-gray-500 text-sm mt-1">Edit your business information</Text>
              </View>
            </View>
            <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center">
              <Ionicons name="storefront" size={24} color="#f97316" />
            </View>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20 }}
        >
          <View className="mb-6">
            <Text className="text-gray-700 font-semibold text-base mb-2">
              Business Name <Text className="text-red-500">*</Text>
            </Text>
            <View className="bg-white rounded-xl px-4 py-3 border border-gray-200">
              <TextInput
                className="text-gray-900 text-base"
                placeholder="Enter your business name"
                placeholderTextColor="#9ca3af"
                value={businessName}
                onChangeText={setBusinessName}
                maxLength={200}
              />
            </View>
            <Text className="text-gray-400 text-xs mt-1">{businessName.length}/200 characters</Text>
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 font-semibold text-base mb-2">Description</Text>
            <View className="bg-white rounded-xl px-4 py-3 border border-gray-200">
              <TextInput
                className="text-gray-900 text-base"
                placeholder="Describe your business"
                placeholderTextColor="#9ca3af"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={1000}
              />
            </View>
            <Text className="text-gray-400 text-xs mt-1">{description.length}/1000 characters</Text>
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 font-semibold text-base mb-2">
              Business Type <Text className="text-red-500">*</Text>
            </Text>
            <View className="flex-row flex-wrap" style={{ gap: 12 }}>
              {businessTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  className={`flex-row items-center px-4 py-3 rounded-xl border ${
                    businessType === type.value
                      ? 'bg-orange-50 border-orange-500'
                      : 'bg-white border-gray-200'
                  }`}
                  activeOpacity={0.7}
                  onPress={() => setBusinessType(type.value)}
                  style={{ width: '48%' }}
                >
                  <View className={`w-8 h-8 rounded-lg items-center justify-center mr-2 ${
                    businessType === type.value ? 'bg-orange-100' : 'bg-gray-100'
                  }`}>
                    <Ionicons
                      name={type.icon as any}
                      size={18}
                      color={businessType === type.value ? '#f97316' : '#6b7280'}
                    />
                  </View>
                  <Text className={`font-medium ${
                    businessType === type.value ? 'text-orange-600' : 'text-gray-700'
                  }`}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="bg-blue-50 rounded-xl p-4 mb-6 flex-row">
            <Ionicons name="information-circle" size={20} color="#3b82f6" />
            <View className="flex-1 ml-3">
              <Text className="text-blue-900 font-medium text-sm mb-1">Profile Visibility</Text>
              <Text className="text-blue-700 text-xs">
                Your business information will be visible to customers searching for services in your area.
              </Text>
            </View>
          </View>
        </ScrollView>

        <View className="bg-white px-5 py-4 border-t border-gray-100">
          <TouchableOpacity
            className="bg-orange-500 py-4 rounded-xl flex-row items-center justify-center"
            activeOpacity={0.8}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={20} color="#ffffff" />
                <Text className="text-white font-semibold text-base ml-2">Save Changes</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
