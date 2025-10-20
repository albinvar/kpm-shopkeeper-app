import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator, Alert, Switch, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { router } from 'expo-router';
import shopService from '../services/shopService';
import { BusinessHour } from '../lib/api/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OperatingHoursScreen() {
  const insets = useSafeAreaInsets();
  const { shop, setShop } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [timeType, setTimeType] = useState<'open' | 'close'>('open');

  const daysOfWeek = [
    { key: 'monday', label: 'Monday', icon: 'calendar-outline' },
    { key: 'tuesday', label: 'Tuesday', icon: 'calendar-outline' },
    { key: 'wednesday', label: 'Wednesday', icon: 'calendar-outline' },
    { key: 'thursday', label: 'Thursday', icon: 'calendar-outline' },
    { key: 'friday', label: 'Friday', icon: 'calendar-outline' },
    { key: 'saturday', label: 'Saturday', icon: 'calendar-outline' },
    { key: 'sunday', label: 'Sunday', icon: 'calendar-outline' },
  ];

  const timeSlots = [
    '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30',
    '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30',
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30',
  ];

  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([
    { day: 'monday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
    { day: 'tuesday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
    { day: 'wednesday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
    { day: 'thursday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
    { day: 'friday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
    { day: 'saturday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
    { day: 'sunday', isOpen: false, openTime: '09:00', closeTime: '21:00' },
  ]);

  useEffect(() => {
    if (shop?.businessHours && shop.businessHours.length > 0) {
      setBusinessHours(shop.businessHours as BusinessHour[]);
    }
  }, [shop]);

  const toggleDay = (day: string) => {
    setBusinessHours(prev =>
      prev.map(hour =>
        hour.day === day ? { ...hour, isOpen: !hour.isOpen } : hour
      )
    );
  };

  const openTimePicker = (day: string, type: 'open' | 'close') => {
    setSelectedDay(day);
    setTimeType(type);
    setShowTimePicker(true);
  };

  const selectTime = (time: string) => {
    if (!selectedDay) return;
    setBusinessHours(prev =>
      prev.map(hour =>
        hour.day === selectedDay
          ? { ...hour, [timeType === 'open' ? 'openTime' : 'closeTime']: time }
          : hour
      )
    );
    setShowTimePicker(false);
  };

  const applyToAllDays = (sourceDay: string) => {
    const source = businessHours.find(h => h.day === sourceDay);
    if (!source) return;

    Alert.alert(
      'Apply to All Days',
      `Apply ${source.isOpen ? `${source.openTime} - ${source.closeTime}` : 'Closed'} to all days?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Apply',
          onPress: () => {
            setBusinessHours(prev =>
              prev.map(hour => ({
                ...hour,
                isOpen: source.isOpen,
                openTime: source.openTime,
                closeTime: source.closeTime,
              }))
            );
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    if (!shop?.id) {
      Alert.alert('Error', 'Shop information not available');
      return;
    }

    try {
      setIsSaving(true);
      const response = await shopService.updateBusinessHours(shop.id, { businessHours });

      if (response.status === 'success' && response.data) {
        const updatedShop = { ...shop, ...response.data.shop };
        setShop(updatedShop);
        await AsyncStorage.setItem('shopData', JSON.stringify(updatedShop));

        Alert.alert('Success', 'Operating hours updated successfully', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    } catch (error: any) {
      console.error('Save error:', error);
      Alert.alert('Error', error.message || 'Failed to update operating hours');
    } finally {
      setIsSaving(false);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" translucent={false} />

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
              <Text className="text-gray-900 text-2xl font-bold">Operating Hours</Text>
              <Text className="text-gray-500 text-sm mt-1">Set your shop timing</Text>
            </View>
          </View>
          <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center">
            <Ionicons name="time" size={24} color="#f97316" />
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      >
        {daysOfWeek.map((day) => {
          const dayHours = businessHours.find(h => h.day === day.key);
          if (!dayHours) return null;

          return (
            <View key={day.key} className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center flex-1">
                  <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center mr-3">
                    <Ionicons name={day.icon as any} size={20} color="#f97316" />
                  </View>
                  <Text className="text-gray-900 font-semibold text-base">{day.label}</Text>
                </View>
                <Switch
                  value={dayHours.isOpen}
                  onValueChange={() => toggleDay(day.key)}
                  trackColor={{ false: '#f3f4f6', true: '#fed7aa' }}
                  thumbColor={dayHours.isOpen ? '#f97316' : '#ffffff'}
                  ios_backgroundColor="#f3f4f6"
                />
              </View>

              {dayHours.isOpen && (
                <>
                  <View className="flex-row items-center mb-3" style={{ gap: 12 }}>
                    <TouchableOpacity
                      className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-200"
                      activeOpacity={0.7}
                      onPress={() => openTimePicker(day.key, 'open')}
                    >
                      <Text className="text-gray-500 text-xs mb-1">Opens</Text>
                      <Text className="text-gray-900 font-semibold text-base">
                        {formatTime(dayHours.openTime || '09:00')}
                      </Text>
                    </TouchableOpacity>

                    <Ionicons name="arrow-forward" size={20} color="#9ca3af" />

                    <TouchableOpacity
                      className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-200"
                      activeOpacity={0.7}
                      onPress={() => openTimePicker(day.key, 'close')}
                    >
                      <Text className="text-gray-500 text-xs mb-1">Closes</Text>
                      <Text className="text-gray-900 font-semibold text-base">
                        {formatTime(dayHours.closeTime || '21:00')}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    className="bg-orange-50 rounded-lg p-2 flex-row items-center justify-center"
                    activeOpacity={0.7}
                    onPress={() => applyToAllDays(day.key)}
                  >
                    <Ionicons name="copy-outline" size={16} color="#f97316" />
                    <Text className="text-orange-600 text-xs font-medium ml-1">Apply to all days</Text>
                  </TouchableOpacity>
                </>
              )}

              {!dayHours.isOpen && (
                <View className="bg-gray-50 rounded-lg p-3">
                  <Text className="text-gray-500 text-center font-medium">Closed</Text>
                </View>
              )}
            </View>
          );
        })}

        <View className="bg-blue-50 rounded-xl p-4 mt-3 flex-row">
          <Ionicons name="information-circle" size={20} color="#3b82f6" />
          <View className="flex-1 ml-3">
            <Text className="text-blue-900 font-medium text-sm mb-1">Customer Visibility</Text>
            <Text className="text-blue-700 text-xs">
              Your operating hours will be displayed to customers. They can only place orders during these times.
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

      <Modal
        visible={showTimePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTimePicker(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-end"
          activeOpacity={1}
          onPress={() => setShowTimePicker(false)}
        >
          <View className="bg-white rounded-t-3xl max-h-[60%]">
            <View className="p-4 border-b border-gray-100">
              <Text className="text-gray-900 font-bold text-lg text-center">
                Select {timeType === 'open' ? 'Opening' : 'Closing'} Time
              </Text>
            </View>
            <ScrollView className="px-4 py-2" showsVerticalScrollIndicator={false}>
              {timeSlots.map(time => (
                <TouchableOpacity
                  key={time}
                  className="py-4 border-b border-gray-100"
                  activeOpacity={0.7}
                  onPress={() => selectTime(time)}
                >
                  <Text className="text-gray-900 font-medium text-center text-base">
                    {formatTime(time)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
