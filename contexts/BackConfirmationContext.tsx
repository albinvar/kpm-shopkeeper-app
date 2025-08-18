import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import { BackHandler, View, Text, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Modal from 'react-native-modal';

interface BackConfirmationConfig {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface BackConfirmationContextType {
  showBackConfirmation: (config: BackConfirmationConfig) => void;
  hideBackConfirmation: () => void;
  setBackConfirmationEnabled: (enabled: boolean) => void;
  isBackConfirmationEnabled: boolean;
}

const BackConfirmationContext = createContext<BackConfirmationContextType | undefined>(undefined);

interface BackConfirmationProviderProps {
  children: ReactNode;
}

export function BackConfirmationProvider({ children }: BackConfirmationProviderProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isBackConfirmationEnabled, setIsBackConfirmationEnabled] = useState(false);
  const configRef = useRef<BackConfirmationConfig>({});

  const showBackConfirmation = (config: BackConfirmationConfig) => {
    configRef.current = config;
    setIsModalVisible(true);
  };

  const hideBackConfirmation = () => {
    setIsModalVisible(false);
    configRef.current = {};
  };

  const handleConfirm = () => {
    const { onConfirm } = configRef.current;
    hideBackConfirmation();
    onConfirm?.();
  };

  const handleCancel = () => {
    const { onCancel } = configRef.current;
    hideBackConfirmation();
    onCancel?.();
  };

  // Global back handler
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isBackConfirmationEnabled && !isModalVisible) {
          showBackConfirmation({
            title: 'Exit App',
            message: 'Are you sure you want to exit?',
            confirmText: 'Exit',
            cancelText: 'Cancel',
            onConfirm: () => BackHandler.exitApp(),
          });
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [isBackConfirmationEnabled, isModalVisible])
  );

  const value: BackConfirmationContextType = {
    showBackConfirmation,
    hideBackConfirmation,
    setBackConfirmationEnabled: setIsBackConfirmationEnabled,
    isBackConfirmationEnabled,
  };

  return (
    <BackConfirmationContext.Provider value={value}>
      {children}
      {isModalVisible && (
        <BackConfirmationModal
          {...configRef.current}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </BackConfirmationContext.Provider>
  );
}

interface BackConfirmationModalProps extends BackConfirmationConfig {
  onConfirm: () => void;
  onCancel: () => void;
}

function BackConfirmationModal({
  title = 'Confirm',
  message = 'Are you sure?',
  confirmText = 'Yes',
  cancelText = 'No',
  onConfirm,
  onCancel,
}: BackConfirmationModalProps) {
  return (
    <Modal
      isVisible={true}
      onBackdropPress={onCancel}
      onBackButtonPress={onCancel}
      backdropOpacity={0.5}
      animationIn="fadeIn"
      animationOut="fadeOut"
      className="flex justify-center items-center"
    >
      <View className="bg-white rounded-2xl p-6 mx-4 w-full max-w-sm">
        <Text className="text-lg font-semibold text-gray-900 mb-2 text-center">
          {title}
        </Text>
        <Text className="text-gray-600 text-center mb-6">
          {message}
        </Text>
        
        <View className="flex-row space-x-3">
          <TouchableOpacity
            onPress={onCancel}
            className="flex-1 py-3 px-4 bg-gray-100 rounded-lg"
          >
            <Text className="text-gray-700 text-center font-medium">
              {cancelText}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={onConfirm}
            className="flex-1 py-3 px-4 bg-orange-500 rounded-lg"
          >
            <Text className="text-white text-center font-medium">
              {confirmText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export function useBackConfirmation() {
  const context = useContext(BackConfirmationContext);
  if (!context) {
    throw new Error('useBackConfirmation must be used within a BackConfirmationProvider');
  }
  return context;
}