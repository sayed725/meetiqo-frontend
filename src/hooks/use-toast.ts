import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  message: string;
  variant: 'default' | 'destructive';
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    ({ message, variant = 'default' }: { message: string; variant?: 'default' | 'destructive' }) => {
      const id = Math.random().toString(36).substring(7);
      setToasts((prev) => [...prev, { id, message, variant }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, toast, dismiss };
}
