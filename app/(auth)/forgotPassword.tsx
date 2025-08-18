import { Stack } from "expo-router";
import React from "react";
import { Image, Text, TextInput, View } from "react-native";
import LockIcon from "../../assets/images/lock.svg";
import { ScrollView } from "react-native-gesture-handler";


export default function ForgotPasswordScreen() {
    return (
        <>
            {/* If you're hiding the header intentionally, uncomment this */}
            <Stack.Screen options={{ headerShown: false }} />

            <View className="flex-1 px-6 bg-white ">
                {/* Logo slightly below the top */}
                <Image
                    source={require("../../assets/images/logo2.png")}
                    className="w-32 h-32 mt-20 mb-8"
                    resizeMode="contain"
                />

                {/* Forgot Password Title */}
                <View>
                    <Text className="mt-20 text-xl font-semibold text-black">
                        Forgot Password
                    </Text>
                    <Text className="mt-4 text-gray-400 text-md">
                        Enter your email address to reset your password
                    </Text>
                </View>

                <ScrollView contentContainerStyle={{ alignItems: 'center', padding: 24 }}>
                    <LockIcon width={240} height={300} style={{ marginTop: 40 }} />
                    <View>
                        <TextInput
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            className="w-11/12 px-6 mt-10 text-base text-black border border-gray-300 rounded-lg h-14"
                        />
                    </View>
                </ScrollView>
            </View>
        </>
    );
}
