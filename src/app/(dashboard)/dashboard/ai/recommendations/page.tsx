'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Sparkles,
  Loader2,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EventCard, EventCardSkeleton } from '@/components/events/EventCard';
import { queryKeys } from '@/lib/query-keys';
import api from '@/lib/api';

interface RecommendationResult {
  recommendedEventIds: string[];
  reasoning: string;
}

interface EventItem {
  id: string;
  slug: string;
  title: string;
  bannerImage: string | null;
  startDate: string;
  location: string;
  category: string;
  price: number;
  isPaid: boolean;
  type: 'PUBLIC' | 'PRIVATE';
  organizer: { name: string; avatar: string | null };
  averageRating: number | null;
  participantCount: number;
}

export default function RecommendationsPage() {
  const [triggered, setTriggered] = useState(false);

  const {
    data: result,
    isLoading: resultLoading,
    isFetching,
    refetch,
    error,
  } = useQuery<RecommendationResult>({
    queryKey: queryKeys.ai.recommendations,
    queryFn: async () => {
      const res = await api.post('/ai/recommendations');
      return res.data.data;
    },
    enabled: triggered,
    staleTime: 60 * 60 * 1000,
  });

  const {
    data: events,
    isLoading: eventsLoading,
  } = useQuery<EventItem[]>({
    queryKey: [...queryKeys.events.all, 'recommended', result?.recommendedEventIds],
    queryFn: async () => {
      if (!result?.recommendedEventIds?.length) return [];
      const res = await api.get(
        `/events?ids=${result.recommendedEventIds.join(',')}`
      );
      return res.data.data?.events || [];
    },
    enabled: !!result?.recommendedEventIds?.length,
    staleTime: 60 * 60 * 1000,
  });

  const sortedEvents = events
    ?.sort((a, b) => {
      const aIndex = result?.recommendedEventIds.indexOf(a.id) ?? -1;
      const bIndex = result?.recommendedEventIds.indexOf(b.id) ?? -1;
      return aIndex - bIndex;
    })
    .slice(0, 3);

  const cacheRemaining = 60 * 60; // 1 hour in seconds (approximate for display)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Smart Recommendations</h1>
        <p className="text-sm text-muted-foreground">
          AI-curated events based on your interests and activity.
        </p>
      </div>

      {!triggered && (
        <Card className="py-12">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-50">
              <Sparkles className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                Get My Personalized Recommendations
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Our AI analyzes your past events and preferences to find the best
                upcoming events for you.
              </p>
            </div>
            <Button
              onClick={() => {
                setTriggered(true);
              }}
              size="lg"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Get Recommendations
            </Button>
          </CardContent>
        </Card>
      )}

      {triggered && resultLoading && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Analyzing your preferences and finding events...
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
          </div>
        </div>
      )}

      {triggered && error && (
        <Card className="py-8">
          <CardContent className="text-center text-sm text-muted-foreground">
            Failed to load recommendations.{' '}
            <Button variant="link" onClick={() => refetch()}>
              Try again
            </Button>
          </CardContent>
        </Card>
      )}

      {triggered && result && (
        <div className="space-y-6">
          {/* Reasoning */}
          <Card className="bg-purple-50 border-purple-100">
            <CardContent className="py-4 flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-purple-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-purple-900">
                  Why these events?
                </p>
                <p className="text-sm text-purple-800 mt-1">
                  {result.reasoning}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Event Cards */}
          {eventsLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <EventCardSkeleton />
              <EventCardSkeleton />
              <EventCardSkeleton />
            </div>
          ) : sortedEvents && sortedEvents.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sortedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <Card className="py-8">
              <CardContent className="text-center text-sm text-muted-foreground">
                No matching events found at the moment.
              </CardContent>
            </Card>
          )}

          {/* Refresh */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Cached result. Refreshes in ~1 hour.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              {isFetching ? (
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-3 w-3" />
              )}
              Refresh
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
