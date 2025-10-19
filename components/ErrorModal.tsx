import React from 'react';
import { View, Text, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

interface ErrorModalProps {
  visible: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  type?: 'error' | 'warning' | 'info';
}

export default function ErrorModal({
  visible,
  title = 'Oops!',
  message,
  onClose,
  type = 'error'
}: ErrorModalProps) {
  const iconConfig = {
    error: { name: 'close-circle' as const, color: '#ef4444' },
    warning: { name: 'warning' as const, color: '#f59e0b' },
    info: { name: 'information-circle' as const, color: '#3b82f6' },
  };

  const config = iconConfig[type];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView intensity={20} tint="dark" style={{ flex: 1 }}>
        <View className="flex-1 justify-center items-center px-6 bg-black/40">
          <Animated.View
            entering={FadeInUp.duration(300)}
            className="bg-white rounded-3xl w-full overflow-hidden"
            style={{
              maxWidth: width - 48,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 20,
            }}
          >
            {/* Header with icon */}
            <View className="items-center pt-8 pb-4 px-6">
              <Animated.View
                entering={FadeIn.delay(100).duration(400)}
                className="bg-gray-100 rounded-full p-4 mb-4"
                style={{
                  shadowColor: config.color,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  elevation: 5,
                }}
              >
                <Ionicons name={config.name} size={56} color={config.color} />
              </Animated.View>

              <Animated.View
                entering={FadeIn.delay(150).duration(400)}
                className="items-center"
              >
                <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
                  {title}
                </Text>
                <Text className="text-base text-gray-600 text-center leading-6">
                  {message}
                </Text>
              </Animated.View>
            </View>

            {/* Action Button */}
            <Animated.View
              entering={FadeIn.delay(200).duration(400)}
              className="p-6 pt-4"
            >
              <TouchableOpacity
                onPress={onClose}
                activeOpacity={0.9}
                style={{
                  shadowColor: '#f97316',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <LinearGradient
                  colors={['#f97316', '#fb923c']}
                  style={{
                    paddingVertical: 16,
                    paddingHorizontal: 32,
                    borderRadius: 16,
                    alignItems: 'center',
                  }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text className="text-lg font-bold text-white">
                    Got it
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </View>
      </BlurView>
    </Modal>
  );
}
