import { useCallback, useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useBackConfirmation } from '../contexts/BackConfirmationContext';

interface ScreenBackConfirmationOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  enabled?: boolean;
}

export function useScreenBackConfirmation(options: ScreenBackConfirmationOptions = {}) {
  const { showBackConfirmation } = useBackConfirmation();
  const {
    title = 'Go Back',
    message = 'Are you sure you want to go back? Your changes may be lost.',
    confirmText = 'Go Back',
    cancelText = 'Stay',
    onConfirm,
    onCancel,
    enabled = true,
  } = options;

  useFocusEffect(
    useCallback(() => {
      if (!enabled) return;

      const onBackPress = () => {
        showBackConfirmation({
          title,
          message,
          confirmText,
          cancelText,
          onConfirm: () => {
            onConfirm?.();
            // If no custom onConfirm provided, go back by default
            if (!onConfirm && BackHandler.exitApp) {
              // For the last screen in stack, exit app
              BackHandler.exitApp();
            }
          },
          onCancel,
        });
        return true; // Prevent default back action
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [enabled, title, message, confirmText, cancelText, onConfirm, onCancel, showBackConfirmation])
  );
}