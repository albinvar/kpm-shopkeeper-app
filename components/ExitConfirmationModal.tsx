import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  BackHandler,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { 
  FadeIn, 
  FadeOut, 
  SlideInDown, 
  SlideOutDown 
} from "react-native-reanimated";

interface ExitConfirmationModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm?: () => void;
  title?: string;
  message?: string;
  cancelText?: string;
  confirmText?: string;
  icon?: string;
  iconColor?: string;
  confirmButtonColor?: string;
}

export default function ExitConfirmationModal({
  visible,
  onCancel,
  onConfirm,
  title = "Exit App?",
  message = "Are you sure you want to exit KPM Partner?",
  cancelText = "Stay",
  confirmText = "Exit",
  icon = "exit-outline",
  iconColor = "#f97316",
  confirmButtonColor = "#f97316",
}: ExitConfirmationModalProps) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      BackHandler.exitApp();
    }
  };

  if (!visible) return null;

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent={true}
    >
      {/* Overlay */}
      <Pressable 
        style={styles.overlay} 
        onPress={onCancel}
      >
        <View style={styles.centeredView}>
          {/* Modal Content - Stop propagation to prevent closing when tapping inside */}
          <Pressable>
            <Animated.View
              entering={SlideInDown.duration(300).springify()}
              exiting={SlideOutDown.duration(200)}
              style={styles.modalView}
            >
              {/* Icon */}
              <View style={styles.iconContainer}>
                <View
                  style={[
                    styles.iconBackground,
                    { backgroundColor: `${iconColor}20` }
                  ]}
                >
                  <Ionicons
                    name={icon as any}
                    size={40}
                    color={iconColor}
                  />
                </View>
              </View>

              {/* Title */}
              <Text style={styles.modalTitle}>
                {title}
              </Text>

              {/* Message */}
              <Text style={styles.modalMessage}>
                {message}
              </Text>

              {/* Buttons */}
              <View style={styles.buttonContainer}>
                {/* Cancel Button */}
                <TouchableOpacity
                  onPress={onCancel}
                  style={[styles.button, styles.cancelButton]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelButtonText}>
                    {cancelText}
                  </Text>
                </TouchableOpacity>

                {/* Confirm Button */}
                <TouchableOpacity
                  onPress={handleConfirm}
                  style={[
                    styles.button, 
                    styles.confirmButton,
                    { backgroundColor: confirmButtonColor }
                  ]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmButtonText}>
                    {confirmText}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    marginRight: 6,
  },
  confirmButton: {
    marginLeft: 6,
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 16,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});