'use client';

import { useQuery } from '@tanstack/react-query';
import { TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
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

  // Marquee Logic: Duplicate events for seamless loop
  const marqueeEvents = data ? [...data, ...data, ...data] : [];

  return (
    <section className="py-16 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Trending This Week
          </h2>
        </div>

        <div className="relative">
          {isLoading || !data ? (
            <div className="flex gap-6 overflow-hidden pb-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-full w-72 shrink-0">
                  <EventCard isLoading />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative flex overflow-hidden">
              <motion.div
                animate={{ x: ['0%', '-33.33%'] }}
                transition={{
                  duration: 40,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="flex items-stretch gap-3 w-max py-4"
                whileHover={{ animationPlayState: 'paused' }}
              >
                {marqueeEvents.map((event, idx) => (
                  <div key={`${event.id}-${idx}`} className="h-full w-72 shrink-0">
                    <EventCard event={event} priority={idx < 2} />
                  </div>
                ))}
              </motion.div>

              {/* Fade Gradients for Edges */}
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
