import { useEffect } from 'react';
import { useBackConfirmation } from '../contexts/BackConfirmationContext';

interface GlobalBackConfirmationOptions {
  enabled?: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

export function useGlobalBackConfirmation(options: GlobalBackConfirmationOptions = {}) {
  const { setBackConfirmationEnabled } = useBackConfirmation();
  const {
    enabled = true,
  } = options;

  useEffect(() => {
    setBackConfirmationEnabled(enabled);
    return () => setBackConfirmationEnabled(false);
  }, [enabled, setBackConfirmationEnabled]);
}