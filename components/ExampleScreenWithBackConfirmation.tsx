import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useScreenBackConfirmation } from '../hooks/useScreenBackConfirmation';
import { useBackConfirmation } from '../contexts/BackConfirmationContext';

export default function ExampleScreenWithBackConfirmation() {
  const router = useRouter();
  const { showBackConfirmation } = useBackConfirmation();
  const [formData, setFormData] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Example 1: Screen-level back confirmation with custom logic
  useScreenBackConfirmation({
    enabled: hasUnsavedChanges, // Only show when there are unsaved changes
    title: 'Discard Changes?',
    message: 'You have unsaved changes. Are you sure you want to go back?',
    confirmText: 'Discard',
    cancelText: 'Keep Editing',
    onConfirm: () => {
      // Custom logic when user confirms
      console.log('User chose to discard changes');
      router.back();
    },
    onCancel: () => {
      // Custom logic when user cancels
      console.log('User chose to keep editing');
    },
  });

  const handleFormChange = (text: string) => {
    setFormData(text);
    setHasUnsavedChanges(text.length > 0);
  };

  // Example 2: Manual back confirmation trigger
  const handleCustomAction = () => {
    showBackConfirmation({
      title: 'Custom Action',
      message: 'This will perform a custom action. Continue?',
      confirmText: 'Continue',
      cancelText: 'Cancel',
      onConfirm: () => {
        // Perform custom action
        console.log('Custom action confirmed');
      },
    });
  };

  const handleSave = () => {
    // Simulate saving
    setHasUnsavedChanges(false);
    console.log('Form saved');
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-4">
        Back Confirmation Example
      </Text>
      
      <Text className="text-gray-600 mb-4">
        This screen demonstrates back button confirmation:
        - Type something to enable back confirmation
        - Try pressing the back button (Android hardware back or navigation)
        - Use the custom action button to trigger manual confirmation
      </Text>

      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4"
        placeholder="Type something to enable back confirmation..."
        value={formData}
        onChangeText={handleFormChange}
        multiline
        numberOfLines={4}
      />

      {hasUnsavedChanges && (
        <Text className="text-orange-500 mb-4">
          ⚠️ You have unsaved changes
        </Text>
      )}

      <View className="space-y-3">
        <TouchableOpacity
          onPress={handleSave}
          className="bg-green-500 py-3 px-4 rounded-lg"
          disabled={!hasUnsavedChanges}
        >
          <Text className="text-white text-center font-medium">
            Save Changes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCustomAction}
          className="bg-blue-500 py-3 px-4 rounded-lg"
        >
          <Text className="text-white text-center font-medium">
            Trigger Custom Confirmation
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-gray-500 py-3 px-4 rounded-lg"
        >
          <Text className="text-white text-center font-medium">
            Manual Back (No Confirmation)
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}