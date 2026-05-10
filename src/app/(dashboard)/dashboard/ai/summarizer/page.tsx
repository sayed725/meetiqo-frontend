'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Loader2,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  Star,
  MessageSquare,
  Frown,
  Meh,
  Smile,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/auth-store';
import { queryKeys } from '@/lib/query-keys';
import api from '@/lib/api';

interface SummarizeResult {
  summary: string;
  overallSentiment: 'POSITIVE' | 'MIXED' | 'NEGATIVE';
  keyPraises: string[];
  keyComplaints: string[];
  improvementSuggestions: string[];
  averageRating: number;
}

interface UserEvent {
  id: string;
  title: string;
}

const sentimentConfig = {
  POSITIVE: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: Smile, label: 'Positive' },
  MIXED: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Meh, label: 'Mixed' },
  NEGATIVE: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: Frown, label: 'Negative' },
};

export default function ReviewSummarizerPage() {
  const user = useAuthStore((s) => s.user);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [result, setResult] = useState<SummarizeResult | null>(null);

  const { data: myEvents } = useQuery<UserEvent[]>({
    queryKey: queryKeys.events.myEvents,
    queryFn: async () => {
      const res = await api.get('/events/my-events');
      return res.data.data?.events || [];
    },
    enabled: user?.role === 'ORGANIZER' || user?.role === 'ADMIN',
  });

  const summarizeMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/ai/summarize-reviews', {
        eventId: selectedEventId,
      });
      return res.data.data as SummarizeResult;
    },
    onSuccess: (data) => setResult(data),
  });

  const selectedEventTitle = myEvents?.find((e) => e.id === selectedEventId)?.title;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Review Summarizer</h1>
        <p className="text-sm text-muted-foreground">
          Turn event reviews into actionable insights with AI.
        </p>
      </div>

      {/* Event Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Select Event</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Your Event</Label>
            <Select value={selectedEventId} onValueChange={setSelectedEventId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an event to analyze" />
              </SelectTrigger>
              <SelectContent>
                {myEvents?.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => summarizeMutation.mutate()}
            disabled={!selectedEventId || summarizeMutation.isPending}
            className="w-full"
          >
            {summarizeMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing reviews...
              </>
            ) : (
              <>
                <MessageSquare className="mr-2 h-4 w-4" />
                Summarize Reviews
              </>
            )}
          </Button>

          {summarizeMutation.isError && (
            <p className="text-sm text-red-500">
              {(summarizeMutation.error as any)?.response?.data?.error ||
                'Failed to summarize. Make sure there are at least 3 reviews.'}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Header */}
          <Card>
            <CardContent className="py-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{selectedEventTitle}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-2xl font-bold">
                      {result.averageRating.toFixed(1)}
                    </span>
                    <span className="text-sm text-muted-foreground">/ 5</span>
                  </div>
                </div>
                {(() => {
                  const config = sentimentConfig[result.overallSentiment];
                  const Icon = config.icon;
                  return (
                    <Badge className={`flex items-center gap-1 px-3 py-1.5 text-sm ${config.color}`}>
                      <Icon className="h-4 w-4" />
                      {config.label}
                    </Badge>
                  );
                })()}
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{result.summary}</p>
            </CardContent>
          </Card>

          {/* Praises & Complaints */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-green-700">
                  <ThumbsUp className="h-4 w-4" />
                  Key Praises
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.keyPraises.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No praises found.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {result.keyPraises.map((praise, i) => (
                      <Badge
                        key={i}
                        className="bg-green-50 text-green-700 hover:bg-green-100"
                      >
                        {praise}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-red-700">
                  <ThumbsDown className="h-4 w-4" />
                  Key Complaints
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.keyComplaints.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No complaints found.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {result.keyComplaints.map((complaint, i) => (
                      <Badge
                        key={i}
                        className="bg-red-50 text-red-700 hover:bg-red-100"
                      >
                        {complaint}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Lightbulb className="h-4 w-4 text-purple-600" />
                Improvement Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.improvementSuggestions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No suggestions.</p>
              ) : (
                <ul className="space-y-2">
                  {result.improvementSuggestions.map((suggestion, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-medium text-purple-700">
                        {i + 1}
                      </span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
