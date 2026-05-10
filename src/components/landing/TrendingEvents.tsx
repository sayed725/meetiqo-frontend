'use client';

import { useQuery } from '@tanstack/react-query';
import { TrendingUp } from 'lucide-react';
import { EventCard } from '@/components/event-card';
import api from '@/lib/api';

export function TrendingEvents() {
  const { data, isLoading } = useQuery({
    queryKey: ['trending-events'],
    queryFn: async () => {
      const res = await api.get('/events?sortBy=popular&limit=6');
      return res.data.data.events;
    },
  });

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Trending This Week
          </h2>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {isLoading || !data
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-72 shrink-0">
                  <EventCard isLoading />
                </div>
              ))
            : data.map((event: any) => (
                <div key={event.id} className="w-72 shrink-0">
                  <EventCard event={event} />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
