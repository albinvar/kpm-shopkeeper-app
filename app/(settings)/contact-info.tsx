import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { router } from 'expo-router';
import shopService from '../../services/shopService';

export default function ContactInfoScreen() {
  const insets = useSafeAreaInsets();
  const { shop } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  // Load shop data
  useEffect(() => {
    if (shop?.contactInfo) {
      setPhone(shop.contactInfo.phone || '');
      setEmail(shop.contactInfo.email || '');
      setWebsite(shop.contactInfo.website || '');
      setWhatsapp(shop.contactInfo.whatsapp || '');
    }
  }, [shop]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    // Accept formats: +91XXXXXXXXXX or 10 digits
    const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateWebsite = (url: string) => {
    if (!url) return true; // Optional field
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSave = async () => {
    if (!shop?.id) {
      Alert.alert('Error', 'Shop information not available');
      return;
    }

    // Validation
    if (phone && !validatePhone(phone)) {
      Alert.alert('Validation Error', 'Please enter a valid phone number');
      return;
    }

    if (email && !validateEmail(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return;
    }

    if (website && !validateWebsite(website)) {
      Alert.alert('Validation Error', 'Please enter a valid website URL (including http:// or https://)');
      return;
    }

    if (whatsapp && !validatePhone(whatsapp)) {
      Alert.alert('Validation Error', 'Please enter a valid WhatsApp number');
      return;
    }

    try {
      setIsSaving(true);

      // Format phone numbers
      const formatPhone = (num: string) => {
        if (!num) return undefined;
        const cleaned = num.replace(/\s/g, '');
        return cleaned.startsWith('+91') ? cleaned : `+91${cleaned}`;
      };

      const response = await shopService.updateContactInfo(shop.id, {
        phone: formatPhone(phone),
        email: email.trim() || undefined,
        website: website.trim() || undefined,
        whatsapp: formatPhone(whatsapp),
      });

      if (response.status === 'success') {
        Alert.alert('Success', 'Contact information updated successfully', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    } catch (error: any) {
      console.error('Save error:', error);
      Alert.alert('Error', error.message || 'Failed to update contact information');
    } finally {
      setIsSaving(false);
    }
  };

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
            <TouchableOpacity
              className="w-10 h-10 items-center justify-center mr-3"
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-gray-900 text-2xl font-bold">Contact Information</Text>
              <Text className="text-gray-500 text-sm mt-1">Update your contact details</Text>
            </View>
          </View>
          <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center">
            <Ionicons name="call" size={24} color="#f97316" />
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      >
        {/* Phone */}
        <View className="mb-6">
          <Text className="text-gray-700 font-semibold text-base mb-2">
            Phone Number
          </Text>
          <View className="bg-white rounded-xl px-4 py-3 border border-gray-200 flex-row items-center">
            <Ionicons name="call-outline" size={20} color="#9ca3af" />
            <TextInput
              className="flex-1 ml-3 text-gray-900 text-base"
              placeholder="+91 98765 43210"
              placeholderTextColor="#9ca3af"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={15}
            />
          </View>
          <Text className="text-gray-400 text-xs mt-1">
            Format: +91XXXXXXXXXX or 10 digits
          </Text>
        </View>

        {/* Email */}
        <View className="mb-6">
          <Text className="text-gray-700 font-semibold text-base mb-2">
            Email Address
          </Text>
          <View className="bg-white rounded-xl px-4 py-3 border border-gray-200 flex-row items-center">
            <Ionicons name="mail-outline" size={20} color="#9ca3af" />
            <TextInput
              className="flex-1 ml-3 text-gray-900 text-base"
              placeholder="contact@yourbusiness.com"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Website */}
        <View className="mb-6">
          <Text className="text-gray-700 font-semibold text-base mb-2">
            Website
          </Text>
          <View className="bg-white rounded-xl px-4 py-3 border border-gray-200 flex-row items-center">
            <Ionicons name="globe-outline" size={20} color="#9ca3af" />
            <TextInput
              className="flex-1 ml-3 text-gray-900 text-base"
              placeholder="https://yourbusiness.com"
              placeholderTextColor="#9ca3af"
              value={website}
              onChangeText={setWebsite}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>
          <Text className="text-gray-400 text-xs mt-1">
            Include http:// or https://
          </Text>
        </View>

        {/* WhatsApp */}
        <View className="mb-6">
          <Text className="text-gray-700 font-semibold text-base mb-2">
            WhatsApp Number
          </Text>
          <View className="bg-white rounded-xl px-4 py-3 border border-gray-200 flex-row items-center">
            <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
            <TextInput
              className="flex-1 ml-3 text-gray-900 text-base"
              placeholder="+91 98765 43210"
              placeholderTextColor="#9ca3af"
              value={whatsapp}
              onChangeText={setWhatsapp}
              keyboardType="phone-pad"
              maxLength={15}
            />
          </View>
          <Text className="text-gray-400 text-xs mt-1">
            Customers can contact you via WhatsApp
          </Text>
        </View>

        {/* Info Note */}
        <View className="bg-blue-50 rounded-xl p-4 mb-6 flex-row">
          <Ionicons name="information-circle" size={20} color="#3b82f6" />
          <View className="flex-1 ml-3">
            <Text className="text-blue-900 font-medium text-sm mb-1">
              Contact Privacy
            </Text>
            <Text className="text-blue-700 text-xs">
              Your contact details will be shared with customers only after they place an order or need support.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
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
  );
}
