# Back Confirmation System

A comprehensive back button confirmation system for React Native app with global and screen-level support.

## 🚀 Features

- ✅ **Global app exit confirmation** - Shows confirmation when user tries to exit the app
- ✅ **Screen-specific confirmation** - Individual screens can enable custom back confirmation
- ✅ **Hardware back button support** - Works with Android hardware back button
- ✅ **Customizable modal** - Custom title, message, and button text
- ✅ **Context-based architecture** - Easy integration across the app
- ✅ **Conditional enabling** - Only shows when needed (e.g., unsaved changes)

## 📁 Files Created

```
contexts/BackConfirmationContext.tsx    # Main context provider
hooks/useScreenBackConfirmation.tsx     # Screen-level back confirmation hook
hooks/useGlobalBackConfirmation.tsx     # App-level back confirmation hook  
components/ExampleScreenWithBackConfirmation.tsx  # Example implementation
```

## 🔧 Integration

The system is already integrated in `app/_layout.tsx` with the `BackConfirmationProvider` wrapper.

## 📱 Usage Examples

### 1. Global App-Level Confirmation

```tsx
import { useGlobalBackConfirmation } from '../hooks/useGlobalBackConfirmation';

// In your main app component
useGlobalBackConfirmation({
  enabled: true, // Enable global back confirmation
});
```

### 2. Screen-Level Confirmation

```tsx
import { useScreenBackConfirmation } from '../hooks/useScreenBackConfirmation';

// In your screen component
const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

useScreenBackConfirmation({
  enabled: hasUnsavedChanges, // Only show when there are changes
  title: 'Discard Changes?',
  message: 'You have unsaved changes. Are you sure you want to go back?',
  confirmText: 'Discard',
  cancelText: 'Keep Editing',
  onConfirm: () => {
    // Handle confirmation
    router.back();
  },
  onCancel: () => {
    // Handle cancellation
    console.log('User chose to stay');
  },
});
```

### 3. Manual Confirmation Trigger

```tsx
import { useBackConfirmation } from '../contexts/BackConfirmationContext';

const { showBackConfirmation } = useBackConfirmation();

const handleDeleteAction = () => {
  showBackConfirmation({
    title: 'Delete Item',
    message: 'This action cannot be undone. Continue?',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    onConfirm: () => {
      // Perform delete action
      deleteItem();
    },
  });
};
```

## 🎯 Use Cases

1. **Form screens** - Prevent accidental navigation away from unsaved forms
2. **App exit** - Confirm before closing the app
3. **Destructive actions** - Confirm before deleting or modifying data
4. **Multi-step flows** - Prevent accidental back navigation in workflows
5. **Shopping cart** - Confirm before leaving with items in cart

## 🛠️ Configuration Options

```tsx
interface BackConfirmationConfig {
  title?: string;           // Modal title (default: "Confirm")
  message?: string;         // Modal message (default: "Are you sure?")
  confirmText?: string;     // Confirm button text (default: "Yes")
  cancelText?: string;      // Cancel button text (default: "No")
  onConfirm?: () => void;   // Callback when confirmed
  onCancel?: () => void;    // Callback when cancelled
  enabled?: boolean;        // Enable/disable the confirmation
}
```

## 🎨 Modal Design

- Modern design with rounded corners
- Orange primary color matching app theme
- Backdrop blur and fade animations
- Responsive button layout
- Touch-outside-to-cancel support

## 📋 Testing

To test the back confirmation system:

1. Navigate to any screen in the app
2. Add some text/make changes (for screen-level confirmation)
3. Press Android hardware back button or navigation back
4. Confirm modal should appear with appropriate message
5. Test both "Cancel" and "Confirm" actions

## 🔄 Current Integration Status

- ✅ Context provider integrated in root layout
- ✅ Global confirmation enabled in main app flow
- ✅ Example screen with all use cases created
- ✅ Modal styling matches app theme
- ✅ Hardware back button support working

The system is ready for use across all screens in the app!