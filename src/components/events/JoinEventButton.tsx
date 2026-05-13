'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/auth-store';
import api from '@/lib/api';

interface JoinEventButtonProps {
  eventId: string;
  type: 'PUBLIC' | 'PRIVATE';
  isOrganizer: boolean;
  initialStatus?: 'NONE' | 'PENDING' | 'APPROVED';
}

export function JoinEventButton({
  eventId,
  type,
  isOrganizer,
  initialStatus = 'NONE',
}: JoinEventButtonProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [status, setStatus] = useState<'NONE' | 'PENDING' | 'APPROVED'>(initialStatus);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  if (isOrganizer) {
    return (
      <Link href="/dashboard/events">
        <Button className="w-full">Manage Event</Button>
      </Link>
    );
  }

  if (!isAuthenticated) {
    return (
      <Link href="/login">
        <Button className="w-full">Login to Join</Button>
      </Link>
    );
  }

  if (status === 'APPROVED') {
    return (
      <Button disabled className="w-full gap-2 bg-green-600 text-white hover:bg-green-600">
        <Check className="h-4 w-4" />
        Joined
      </Button>
    );
  }

  if (status === 'PENDING') {
    return (
      <Button disabled variant="outline" className="w-full">
        Request Pending
      </Button>
    );
  }

  const handleJoin = async () => {
    const optimisticStatus = type === 'PUBLIC' ? 'APPROVED' : 'PENDING';
    const previousStatus = status;

    // Optimistic update
    setStatus(optimisticStatus);
    setIsLoading(true);

    try {
      await api.post(`/events/${eventId}/join`);
    } catch {
      // Rollback on error
      setStatus(previousStatus);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className="w-full"
      onClick={handleJoin}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : type === 'PRIVATE' ? (
        'Request to Join'
      ) : (
        'Join Event'
      )}
    </Button>
  );
}
