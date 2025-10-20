import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator, Alert, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { router } from 'expo-router';
import shopService from '../services/shopService';
import AsyncStorage from '@react-native-async-storage/async-storage';

type PaymentMethod = 'cash' | 'card' | 'upi' | 'wallet' | 'bank_transfer';

interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
}

export default function PaymentSettingsScreen({ onClose }: { onClose?: () => void }) {
  const insets = useSafeAreaInsets();
  const { shop, setShop } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleBack = () => {
    console.log('Payment Settings handleBack called, onClose:', !!onClose);
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  // Payment Methods State
  const [selectedMethods, setSelectedMethods] = useState<PaymentMethod[]>([]);

  // Bank Details State
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [bankName, setBankName] = useState('');

  const paymentMethodOptions: Array<{
    value: PaymentMethod;
    label: string;
    icon: string;
    description: string;
  }> = [
    { value: 'cash', label: 'Cash on Delivery', icon: 'cash-outline', description: 'Accept cash payments' },
    { value: 'card', label: 'Card Payment', icon: 'card-outline', description: 'Debit/Credit cards' },
    { value: 'upi', label: 'UPI Payment', icon: 'phone-portrait-outline', description: 'Google Pay, PhonePe, etc' },
    { value: 'wallet', label: 'Digital Wallet', icon: 'wallet-outline', description: 'Paytm, Amazon Pay, etc' },
    { value: 'bank_transfer', label: 'Bank Transfer', icon: 'business-outline', description: 'Direct bank transfer' },
  ];

  // Load shop data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 300));

        if (shop) {
          // Load payment methods
          if (shop.settings?.paymentMethods) {
            setSelectedMethods(shop.settings.paymentMethods as PaymentMethod[]);
          }

          // Load bank details if available
          if (shop.documents?.bankDetails) {
            const bankDetails = shop.documents.bankDetails;
            setAccountHolderName(bankDetails.accountHolderName || '');
            setAccountNumber(bankDetails.accountNumber || '');
            setIfscCode(bankDetails.ifscCode || '');
            setBankName(bankDetails.bankName || '');
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [shop]);

  const togglePaymentMethod = (method: PaymentMethod) => {
    setSelectedMethods(prev => {
      if (prev.includes(method)) {
        // Don't allow removing all methods
        if (prev.length === 1) {
          Alert.alert('Error', 'At least one payment method must be enabled');
          return prev;
        }
        return prev.filter(m => m !== method);
      } else {
        return [...prev, method];
      }
    });
  };

  const validateBankDetails = (): boolean => {
    // All fields are optional, but if any is filled, validate them
    const hasAnyBankData = accountHolderName || accountNumber || ifscCode || bankName;

    if (!hasAnyBankData) {
      return true; // All optional, so valid if empty
    }

    // If any field is filled, all must be filled
    if (!accountHolderName.trim()) {
      Alert.alert('Validation Error', 'Please enter account holder name');
      return false;
    }

    if (!accountNumber.trim()) {
      Alert.alert('Validation Error', 'Please enter account number');
      return false;
    }

    if (accountNumber.length < 9 || accountNumber.length > 18) {
      Alert.alert('Validation Error', 'Account number must be between 9-18 digits');
      return false;
    }

    if (!ifscCode.trim()) {
      Alert.alert('Validation Error', 'Please enter IFSC code');
      return false;
    }

    // IFSC code format: 4 letters + 7 characters (letters/digits)
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(ifscCode.toUpperCase())) {
      Alert.alert('Validation Error', 'Please enter a valid IFSC code (e.g., HDFC0001234)');
      return false;
    }

    if (!bankName.trim()) {
      Alert.alert('Validation Error', 'Please enter bank name');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!shop?.id) {
      Alert.alert('Error', 'Shop information not available');
      return;
    }

    if (selectedMethods.length === 0) {
      Alert.alert('Validation Error', 'Please select at least one payment method');
      return;
    }

    if (!validateBankDetails()) {
      return;
    }

    try {
      setIsSaving(true);

      // Update payment methods via settings endpoint
      const settingsResponse = await shopService.updateSettings(shop.id, {
        paymentMethods: selectedMethods,
      });

      if (settingsResponse.status === 'success') {
        const updatedShop = { ...shop, ...settingsResponse.data?.shop };

        // Update bank details if provided
        const hasAnyBankData = accountHolderName || accountNumber || ifscCode || bankName;
        if (hasAnyBankData) {
          const bankResponse = await shopService.updateBankDetails(shop.id, {
            accountHolderName: accountHolderName.trim(),
            accountNumber: accountNumber.trim(),
            ifscCode: ifscCode.toUpperCase().trim(),
            bankName: bankName.trim(),
          });

          if (bankResponse.status === 'success' && bankResponse.data?.bankDetails) {
            // Merge bank details into shop object
            updatedShop.documents = {
              ...updatedShop.documents,
              bankDetails: bankResponse.data.bankDetails,
            };
          }
        }

        setShop(updatedShop);
        await AsyncStorage.setItem('shopData', JSON.stringify(updatedShop));

        Alert.alert('Success', 'Payment settings updated successfully', [
          { text: 'OK', onPress: handleBack }
        ]);
      }
    } catch (error: any) {
      console.error('Save error:', error);
      Alert.alert('Error', error.message || 'Failed to update payment settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" translucent={false} />

      <View
        className="bg-white px-5 pb-4"
        style={{ paddingTop: insets.top + 16 }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity
              className="w-10 h-10 items-center justify-center mr-3"
              onPress={handleBack}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-gray-900 text-xl font-bold">Payment Settings</Text>
              <Text className="text-gray-500 text-sm mt-1">Configure payment options</Text>
            </View>
          </View>
          <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center">
            <Ionicons name="wallet" size={24} color="#f97316" />
          </View>
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center" style={{ paddingTop: 100 }}>
          <ActivityIndicator size="large" color="#f97316" />
          <Text className="text-gray-500 mt-4">Loading payment settings...</Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20 }}
        >
          {/* Payment Methods Section */}
          <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <Text className="text-gray-900 font-semibold text-base mb-3">
              Payment Methods <Text className="text-red-500">*</Text>
            </Text>
            <Text className="text-gray-500 text-sm mb-4">
              Select payment methods you want to accept
            </Text>

            {paymentMethodOptions.map((option) => {
              const isSelected = selectedMethods.includes(option.value);
              return (
                <TouchableOpacity
                  key={option.value}
                  className={`flex-row items-center p-3 rounded-xl mb-3 ${
                    isSelected ? 'bg-orange-50' : 'bg-gray-50'
                  }`}
                  activeOpacity={0.7}
                  onPress={() => togglePaymentMethod(option.value)}
                  style={{
                    borderWidth: 2,
                    borderColor: isSelected ? '#f97316' : 'transparent'
                  }}
                >
                  <View className={`w-12 h-12 rounded-xl items-center justify-center mr-3 ${
                    isSelected ? 'bg-orange-100' : 'bg-white'
                  }`}>
                    <Ionicons
                      name={option.icon as any}
                      size={24}
                      color={isSelected ? '#f97316' : '#6b7280'}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className={`font-semibold text-base ${
                      isSelected ? 'text-orange-600' : 'text-gray-700'
                    }`}>
                      {option.label}
                    </Text>
                    <Text className="text-gray-500 text-xs mt-0.5">
                      {option.description}
                    </Text>
                  </View>
                  <View className={`w-6 h-6 rounded-full items-center justify-center ${
                    isSelected ? 'bg-orange-500' : 'bg-gray-300'
                  }`}>
                    {isSelected && <Ionicons name="checkmark" size={16} color="#ffffff" />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Bank Details Section */}
          <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <View className="flex-row items-center mb-3">
              <Ionicons name="shield-checkmark" size={20} color="#f97316" />
              <Text className="text-gray-900 font-semibold text-base ml-2">
                Bank Account Details
              </Text>
            </View>
            <Text className="text-gray-500 text-sm mb-4">
              For receiving payment settlements (Optional)
            </Text>

            {/* Account Holder Name */}
            <View className="mb-4">
              <Text className="text-gray-700 font-medium text-sm mb-2">Account Holder Name</Text>
              <View className="bg-gray-50 rounded-xl px-4 py-3 flex-row items-center">
                <Ionicons name="person-outline" size={20} color="#f97316" />
                <TextInput
                  className="flex-1 ml-3 text-gray-900 text-base"
                  placeholder="John Doe"
                  placeholderTextColor="#9ca3af"
                  value={accountHolderName}
                  onChangeText={setAccountHolderName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Account Number */}
            <View className="mb-4">
              <Text className="text-gray-700 font-medium text-sm mb-2">Account Number</Text>
              <View className="bg-gray-50 rounded-xl px-4 py-3 flex-row items-center">
                <Ionicons name="card-outline" size={20} color="#f97316" />
                <TextInput
                  className="flex-1 ml-3 text-gray-900 text-base"
                  placeholder="1234567890123456"
                  placeholderTextColor="#9ca3af"
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                  keyboardType="number-pad"
                  maxLength={18}
                  secureTextEntry
                />
              </View>
            </View>

            {/* IFSC Code */}
            <View className="mb-4">
              <Text className="text-gray-700 font-medium text-sm mb-2">IFSC Code</Text>
              <View className="bg-gray-50 rounded-xl px-4 py-3 flex-row items-center">
                <Ionicons name="business-outline" size={20} color="#f97316" />
                <TextInput
                  className="flex-1 ml-3 text-gray-900 text-base"
                  placeholder="HDFC0001234"
                  placeholderTextColor="#9ca3af"
                  value={ifscCode}
                  onChangeText={(text) => setIfscCode(text.toUpperCase())}
                  autoCapitalize="characters"
                  maxLength={11}
                />
              </View>
              <Text className="text-gray-400 text-xs mt-2">Example: HDFC0001234</Text>
            </View>

            {/* Bank Name */}
            <View className="mb-2">
              <Text className="text-gray-700 font-medium text-sm mb-2">Bank Name</Text>
              <View className="bg-gray-50 rounded-xl px-4 py-3 flex-row items-center">
                <Ionicons name="home-outline" size={20} color="#f97316" />
                <TextInput
                  className="flex-1 ml-3 text-gray-900 text-base"
                  placeholder="HDFC Bank"
                  placeholderTextColor="#9ca3af"
                  value={bankName}
                  onChangeText={setBankName}
                  autoCapitalize="words"
                />
              </View>
            </View>
          </View>

          {/* Info Note */}
          <View className="bg-orange-50 rounded-2xl p-4 mb-6 flex-row">
            <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center mr-3">
              <Ionicons name="lock-closed" size={20} color="#f97316" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-900 font-semibold text-sm mb-1">
                Secure & Private
              </Text>
              <Text className="text-gray-600 text-xs">
                Your bank details are encrypted and stored securely. They are only used for payment settlements and never shared with customers.
              </Text>
            </View>
          </View>
        </ScrollView>
      )}

      {!isLoading && (
        <View className="bg-white px-5 py-4 border-t border-gray-100">
          <TouchableOpacity
            className={`py-4 rounded-xl flex-row items-center justify-center ${
              isSaving ? 'bg-orange-400' : 'bg-orange-500'
            }`}
            activeOpacity={0.8}
            onPress={handleSave}
            disabled={isSaving}
            style={{
              shadowColor: "#f97316",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            {isSaving ? (
              <>
                <ActivityIndicator size="small" color="#ffffff" />
                <Text className="text-white font-semibold text-base ml-2">Saving...</Text>
              </>
            ) : (
              <>
                <Ionicons name="save-outline" size={20} color="#ffffff" />
                <Text className="text-white font-semibold text-base ml-2">Save Changes</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
