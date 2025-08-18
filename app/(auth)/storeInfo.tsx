import { Entypo, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function StoreInfoScreen() {
  const params = useLocalSearchParams();
  const [address, setAddress] = useState(
    params.address ? 
    `${params.address}${params.city ? `, ${params.city}` : ''}` : 
    "17th Street, Dhaka City,\nDholakpur, Karnataka India"
  );
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 px-4 mt-20 bg-white">
        <Text className="mb-4 text-2xl font-semibold text-center">
          Verify Store Details
        </Text>

        {/* Store Card */}
        <View className="overflow-hidden bg-white border-none shadow-md rounded-2xl">
          <Image
            source={require("../../assets/images/supermarket.jpg")}
            className="w-full h-40"
            resizeMode="cover"
          />

          <View className="p-6">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-lg font-bold text-black">Madhav Stores</Text>
              <View className="flex-row items-center px-2 py-1 bg-yellow-100 rounded-full">
                <Text className="text-xs font-semibold text-yellow-600">🏷 Free</Text>
              </View>
            </View>
            <Text className="text-sm text-gray-500">Dholakpur</Text>
          </View>

          <View className="flex-row justify-around p-3 m-5 bg-gray-100 border-none">
            <View className="items-center">
              <Text className="text-base font-bold">12</Text>
              <Text className="text-xs text-gray-500">Products</Text>
            </View>
            <View className="items-center">
              <Text className="text-base font-bold">4.3</Text>
              <Text className="text-xs text-gray-500">Rating</Text>
            </View>
            <View className="items-center">
              <Text className="text-base font-bold">2</Text>
              <Text className="text-xs text-gray-500">Coupons</Text>
            </View>
          </View>
        </View>
    
        {/* Input Fields */}
        <View className="px-4 py-6 space-y-4 bg-gray-50">
          {/* Store Name */}
          <View className="flex-row items-center px-4 py-3 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <FontAwesome name="user-o" size={20} color="#777" style={{ marginRight: 12 }} />
            <TextInput
              className="flex-1 text-base text-black"
              placeholder="Store Name"
              defaultValue="Mahalakshmi Textiles"
            />
          </View>

          {/* Address */}
          <View className="flex-row items-start px-4 py-3 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <Entypo name="location-pin" size={22} color="#777" style={{ marginRight: 12, marginTop: 4 }} />
            <TextInput
              className="flex-1 text-base text-black"
              multiline
              numberOfLines={2}
              placeholder="Address"
              value={address}
              onChangeText={setAddress}
            />
            <TouchableOpacity
              onPress={() => router.push("/(auth)/location")}
              className="ml-2 p-2 bg-orange-100 rounded-lg"
            >
              <MaterialIcons name="edit-location" size={20} color="#f97316" />
            </TouchableOpacity>
          </View>

          {/* Email */}
          <View className="flex-row items-center px-4 py-3 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <MaterialIcons name="email" size={20} color="#777" style={{ marginRight: 12 }} />
            <TextInput
              className="flex-1 text-base text-black"
              placeholder="Email"
              keyboardType="email-address"
              defaultValue="asherehe@gmail.com"
            />
          </View>

          {/* Phone */}
          <View className="flex-row items-center px-4 py-3 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <MaterialIcons name="phone" size={20} color="#777" style={{ marginRight: 12 }} />
            <TextInput
              className="flex-1 text-base text-black"
              placeholder="Phone"
              keyboardType="phone-pad"
              defaultValue="+91 98765 43210"
            />
          </View>
        </View>

        {/* Terms */}
        <View className="items-center px-4 mt-2 mb-6">
          <Text className="text-xs text-center text-gray-500">
            By signing in, you agree to our{" "}
            <Text className="text-blue-500 underline">Terms of Service</Text> and{" "}
            <Text className="text-blue-500 underline">Privacy Policy</Text>.
          </Text>
        </View>
        <View>
          <TouchableOpacity 
          onPress={() => router.push("/(auth)/store-settings")}
            style={{ 
              backgroundColor: '#f97316',
              padding: 12,
              borderRadius: 12,
              alignItems: 'center',
              marginTop:20
            }}
          >
            <Text className="p-2 text-base font-bold text-white">Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
