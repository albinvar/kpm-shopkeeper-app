import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import LeftArrow from '../../assets/icons/arrow-left.svg';
import DeliveryIcon from '../../assets/icons/truck-fast.svg';
import MoneyIcon from '../../assets/icons/money-4.svg';

export default function SubscriptionScreen() {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    setSubscribed(true);
    alert('You’ve subscribed successfully!');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="justify-between flex-1 mt-10 bg-white">
        {/* Scrollable Content */}
        <ScrollView className="px-4 pt-16">
          {/* Header */}
          <View className="relative items-center justify-center mb-6">
            <TouchableOpacity
              className="absolute left-4"
              onPress={() => router.back()}
            >
              <LeftArrow width={24} height={24} />
            </TouchableOpacity>
            <Text className="text-2xl font-semibold text-center">Dedicated Plans</Text>
          </View>

          {/* Orange Banner */}
          <View className="items-center justify-center w-full mb-6">
            <View className="relative w-full p-6 bg-[#FFB700] rounded-xl overflow-hidden">
              {/* Decorative Circles */}
              <View className="absolute w-16 h-16 bg-orange-200 rounded-full -top-4 right-4 opacity-70" />
              <View className="absolute w-16 h-16 bg-orange-100 rounded-full top-6 -right-4 opacity-80" />

              <Text className="mb-2 text-2xl font-bold text-white">
                Just ₹ 500 For Shops
              </Text>
              <Text className="text-sm text-white">
                That’s what the average Prime member saves on delivery fees
              </Text>
            </View>
          </View>

          {/* Features */}
          <Text className="mb-3 text-base font-semibold text-gray-400">Featured</Text>

          {/* Feature Card 1 */}
          <View className="flex-row items-center p-4 mb-3 bg-white shadow-sm rounded-xl">
            <View className="p-2 mr-4 bg-orange-100 rounded-full">
              <DeliveryIcon width={24} height={24} />
            </View>
            <View>
              <Text className="text-base font-semibold">Unlimited free deliveries</Text>
              <Text className="text-sm text-gray-500">
                At Prime veggie, meat, fruit, fish and more
              </Text>
            </View>
          </View>

          {/* Feature Card 2 */}
          <View className="flex-row items-center p-4 mb-8 bg-white shadow-sm rounded-xl">
            <View className="p-2 mr-4 bg-orange-100 rounded-full">
              <MoneyIcon width={24} height={24} />
            </View>
            <View>
              <Text className="text-base font-semibold">Avoid extra fees</Text>
              <Text className="text-sm text-gray-500">
                No service fees, just pay for your products
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Section */}
        <View className="px-4 pb-6 mb-10 bg-white">
          <Text className="mb-2 text-sm text-center text-gray-500">
            First month free, then as per <Text className="font-bold text-black">subscription</Text>
          </Text>
          <TouchableOpacity
            onPress={handleSubscribe}
            className="bg-[#FFB700] py-4 rounded-xl items-center"
          >
            <Text className="text-base font-bold text-white">Subscribe</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
