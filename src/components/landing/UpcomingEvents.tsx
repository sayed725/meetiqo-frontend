'use client';

import { useQuery } from '@tanstack/react-query';
import { CalendarDays } from 'lucide-react';
import { EventCard } from '@/components/event-card';
import api from '@/lib/api';

export function UpcomingEvents() {
  const { data, isLoading } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: async () => {
      const res = await api.get('/events?limit=3');
      return res.data.data.events;
    },
  });

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <CalendarDays className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Upcoming Events
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading || !data
            ? Array.from({ length: 3 }).map((_, i) => (
                <EventCard key={i} isLoading />
              ))
            : data.map((event: any) => (
                <EventCard key={event.id} event={event} />
              ))}
        </div>
      </div>
    </section>
  );
}
