'use client';

import { useNotifications } from '@/hooks/useNotifications';
import { ToastContainer } from '@/components/toast-container';
import { useToast } from '@/hooks/use-toast';

export default function NotificationsProvider() {
  useNotifications();
  const { toasts, dismiss } = useToast();

  return <ToastContainer toasts={toasts} onDismiss={dismiss} />;
}
