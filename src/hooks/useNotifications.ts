'use client';

import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getSocket } from '@/lib/socket';
import { useNotificationsStore } from '@/lib/notifications-store';
import { useToast } from '@/hooks/use-toast';
import { queryKeys } from '@/lib/query-keys';
import api from '@/lib/api';

export function useNotifications() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const addNotification = useNotificationsStore((s) => s.addNotification);
  const setNotifications = useNotificationsStore((s) => s.setNotifications);
  const markRead = useNotificationsStore((s) => s.markRead);
  const markAllReadStore = useNotificationsStore((s) => s.markAllRead);

  const { data } = useQuery({
    queryKey: queryKeys.notifications.list(20),
    queryFn: async () => {
      const res = await api.get('/notifications?limit=20');
      return res.data.data;
    },
    staleTime: 30_000,
  });

  useEffect(() => {
    if (data?.notifications) {
      setNotifications(data.notifications);
    }
  }, [data, setNotifications]);

  useEffect(() => {
    const socket = getSocket();
    socket.connect();

    socket.on('notification', (payload: any) => {
      addNotification(payload);
      toast({
        message: payload.title,
        variant: 'default',
      });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    });

    socket.on('connect_error', (err) => {
      console.warn('Socket connect error:', err.message);
    });

    return () => {
      socket.off('notification');
      socket.off('connect_error');
      socket.disconnect();
    };
  }, [addNotification, toast, queryClient]);

  const handleMarkRead = async (id: string) => {
    markRead(id); // optimistic
    try {
      await api.patch(`/notifications/${id}/read`);
    } catch {
      // silently fail; store already updated optimistically
    }
    queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
  };

  const handleMarkAllRead = async () => {
    markAllReadStore(); // optimistic
    try {
      await api.patch('/notifications/read-all');
    } catch {
      // silently fail
    }
    queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
  };

  return { handleMarkRead, handleMarkAllRead };
}
