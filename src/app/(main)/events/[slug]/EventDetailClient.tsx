'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Clock,
  Copy,
  Share2,
  Bookmark,
  Star,
  Users,
  Lock,
  Sparkles,
  Lightbulb,
  TrendingUp,
  MessageSquare,
  Send,
  X,
  Check,
  Loader2,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';

import { ReviewCard } from '@/components/events/ReviewCard';
import { JoinEventButton } from '@/components/events/JoinEventButton';
import { useAuthStore } from '@/lib/auth-store';
import { queryKeys } from '@/lib/query-keys';
import api from '@/lib/api';

interface EventDetailClientProps {
  event: any;
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function EventDetailClient({ event }: EventDetailClientProps) {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [saved, setSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const isOrganizer = user?.id === event.organizer?.id;
  const isParticipant = event.myParticipation?.status === 'APPROVED';

  const { data: reviewsData } = useQuery({
    queryKey: queryKeys.events.reviews(event.id),
    queryFn: async () => {
      const res = await api.get(`/events/${event.id}/reviews`);
      return res.data.data;
    },
    enabled: !!event.id,
    staleTime: 60_000,
  });

  const { data: participantsData } = useQuery({
    queryKey: queryKeys.events.participants(event.id),
    queryFn: async () => {
      const res = await api.get(`/events/${event.id}/participants`);
      return res.data.data;
    },
    enabled: !!event.id && (event.type === 'PUBLIC' || isParticipant || isOrganizer),
    staleTime: 60_000,
  });

  const { data: aiInsights, isLoading: aiLoading } = useQuery({
    queryKey: queryKeys.ai.insights(event.id),
    queryFn: async () => {
      const res = await api.get(`/ai/event-insights/${event.id}`);
      return res.data.data;
    },
    enabled: !!event.id,
    staleTime: 300_000,
  });

  const submitReview = useMutation({
    mutationFn: async () => {
      await api.post(`/events/${event.id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.reviews(event.id) });
      setReviewOpen(false);
      setReviewRating(0);
      setReviewComment('');
    },
  });

  const canSeeParticipants =
    event.type === 'PUBLIC' || isParticipant || isOrganizer;
  const canWriteReview = isParticipant;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count =
      reviewsData?.reviews?.filter((r: any) => Math.round(r.rating) === star)
        .length || 0;
    const total = reviewsData?.reviews?.length || 1;
    return { star, count, pct: Math.round((count / total) * 100) };
  });

  const copyLocation = () => {
    navigator.clipboard.writeText(event.location);
  };

  const shareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description?.slice(0, 100),
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Banner */}
      <div className="relative h-[300px] w-full sm:h-[400px]">
        {event.bannerImage ? (
          <Image
            src={event.bannerImage}
            alt={event.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-violet-600 to-blue-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{event.category}</Badge>
              {event.type === 'PRIVATE' && (
                <Badge variant="outline" className="gap-1">
                  <Lock className="h-3 w-3" />
                  Private
                </Badge>
              )}
              {event.isPaid ? (
                <Badge className="bg-purple-600 text-white">${event.price}</Badge>
              ) : (
                <Badge className="bg-green-600 text-white">Free</Badge>
              )}
            </div>
            <h1 className="mt-3 text-2xl font-bold text-white drop-shadow-md sm:text-4xl">
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main */}
          <div className="min-w-0 flex-[0.65]">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-6 w-full justify-start overflow-x-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="participants">Participants</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="ai" className="gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Insights
                </TabsTrigger>
              </TabsList>

              {/* Overview */}
              <TabsContent value="overview" className="space-y-6">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-muted-foreground">
                    {event.description || 'No description provided.'}
                  </p>
                </div>

                {event.tags && event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Location</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{event.location}</p>
                        <div className="mt-3 aspect-video w-full overflow-hidden rounded-lg bg-muted">
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                            <MapPin className="h-8 w-8 text-muted-foreground/50" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Organizer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={event.organizer?.avatar || undefined} />
                        <AvatarFallback>
                          {event.organizer?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{event.organizer?.name}</p>
                        <p className="text-xs text-muted-foreground">Event Organizer</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Schedule */}
              <TabsContent value="schedule">
                {event.schedule && event.schedule.length > 0 ? (
                  <div className="relative space-y-4 border-l-2 border-border pl-6">
                    {event.schedule.map((item: any, i: number) => (
                      <div key={i} className="relative">
                        <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-primary bg-background" />
                        <p className="text-xs text-muted-foreground">
                          {formatTime(item.time)}
                        </p>
                        <p className="font-medium">{item.title}</p>
                        {item.description && (
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-muted-foreground">
                    <Clock className="mx-auto mb-3 h-10 w-10 opacity-30" />
                    <p>No schedule added yet.</p>
                  </div>
                )}
              </TabsContent>

              {/* Participants */}
              <TabsContent value="participants">
                {!canSeeParticipants ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <Lock className="mx-auto mb-3 h-10 w-10 opacity-30" />
                    <p>Participant list is private.</p>
                    <p className="text-sm">Join this event to see who is attending.</p>
                  </div>
                ) : participantsData?.participants ? (
                  <>
                    <p className="mb-4 text-sm text-muted-foreground">
                      {participantsData.participants.length} participant
                      {participantsData.participants.length !== 1 ? 's' : ''}
                    </p>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {participantsData.participants.map((p: any) => (
                        <div
                          key={p.user.id}
                          className="flex items-center gap-3 rounded-lg border p-3"
                        >
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={p.user.avatar || undefined} />
                            <AvatarFallback className="text-xs">
                              {p.user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {p.user.name}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {p.status.toLowerCase()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-14 w-full rounded-lg" />
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Reviews */}
              <TabsContent value="reviews" className="space-y-6">
                {/* Rating summary */}
                <Card>
                  <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
                    <div className="text-center">
                      <div className="text-5xl font-bold">
                        {event.averageRating?.toFixed(1) || '0.0'}
                      </div>
                      <div className="mt-1 flex justify-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.round(event.averageRating || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-muted text-muted'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {reviewsData?.reviews?.length || 0} reviews
                      </p>
                    </div>
                    <div className="flex-1 space-y-1">
                      {ratingDistribution.map((d) => (
                        <div key={d.star} className="flex items-center gap-2">
                          <span className="w-3 text-xs">{d.star}</span>
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-yellow-400"
                              style={{ width: `${d.pct}%` }}
                            />
                          </div>
                          <span className="w-6 text-right text-xs text-muted-foreground">
                            {d.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Write review */}
                {canWriteReview && (
                  <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Write a Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Write a Review</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="flex justify-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setReviewRating(i + 1)}
                              className="p-1"
                            >
                              <Star
                                className={`h-7 w-7 transition-colors ${
                                  i < reviewRating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'fill-muted text-muted'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                        <Textarea
                          placeholder="Share your experience..."
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          rows={4}
                        />
                        <Button
                          className="w-full gap-2"
                          disabled={
                            reviewRating === 0 ||
                            !reviewComment.trim() ||
                            submitReview.isPending
                          }
                          onClick={() => submitReview.mutate()}
                        >
                          {submitReview.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                          Submit Review
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                {/* Review list */}
                <div className="space-y-4">
                  {reviewsData?.reviews?.length > 0 ? (
                    reviewsData.reviews.map((review: any) => (
                      <ReviewCard key={review.id} review={review} />
                    ))
                  ) : (
                    <p className="py-8 text-center text-muted-foreground">
                      No reviews yet. Be the first to share your thoughts!
                    </p>
                  )}
                </div>
              </TabsContent>

              {/* AI Insights */}
              <TabsContent value="ai">
                {aiLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : aiInsights ? (
                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <CardTitle className="text-base">Event Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {aiInsights.summary ||
                            'AI-generated summary will appear here based on event data, reviews, and engagement patterns.'}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <CardTitle className="text-base">Predicted Attendance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-3">
                          <div className="text-3xl font-bold">
                            {aiInsights.predictedAttendance || 'High'}
                          </div>
                          <Badge variant="secondary">
                            {aiInsights.confidence || '85%'} confidence
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Based on historical data, category trends, and current
                          sign-up velocity.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-primary" />
                        <CardTitle className="text-base">Smart Suggestions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {(aiInsights.suggestions || [
                            'Consider promoting this event on social media 3 days before.',
                            'Adding an early-bird discount could boost registrations by 20%.',
                            'The optimal time to send reminder emails is 24 hours prior.',
                          ]).map((s: string, i: number) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="py-12 text-center text-muted-foreground">
                    <Sparkles className="mx-auto mb-3 h-10 w-10 opacity-30" />
                    <p>AI insights are being generated.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <aside className="flex-[0.35] space-y-4">
            <Card className="sticky top-24">
              <CardContent className="space-y-5 p-5">
                {/* Date & Time */}
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Date & Time</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(event.startDate)}
                    </p>
                    {event.endDate && (
                      <p className="text-sm text-muted-foreground">
                        to {formatDateTime(event.endDate)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">Location</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {event.location}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-1 h-auto gap-1 px-0 py-1 text-xs"
                      onClick={copyLocation}
                    >
                      <Copy className="h-3 w-3" />
                      Copy address
                    </Button>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-lg font-bold text-muted-foreground">
                    $
                  </span>
                  <div>
                    <p className="text-sm font-medium">Price</p>
                    {event.isPaid ? (
                      <p className="text-sm text-muted-foreground">
                        ${event.price}{' '}
                        <span className="text-xs">Secure Payment</span>
                      </p>
                    ) : (
                      <p className="text-sm text-green-600">Free</p>
                    )}
                  </div>
                </div>

                {/* Organizer */}
                <div className="rounded-lg border p-3">
                  <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                    Hosted by
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={event.organizer?.avatar || undefined} />
                      <AvatarFallback>
                        {event.organizer?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {event.organizer?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Event Organizer
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <JoinEventButton
                  eventId={event.id}
                  type={event.type}
                  isOrganizer={isOrganizer}
                  initialStatus={event.myParticipation?.status || 'NONE'}
                />

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={shareEvent}
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    disabled={saveLoading}
                    onClick={async () => {
                      const next = !saved;
                      setSaved(next);
                      setSaveLoading(true);
                      try {
                        if (next) {
                          await api.post(`/events/${event.id}/save`);
                        } else {
                          await api.delete(`/events/${event.id}/save`);
                        }
                      } catch {
                        setSaved(!next); // rollback
                      } finally {
                        setSaveLoading(false);
                      }
                    }}
                  >
                    {saveLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Bookmark
                        className={`h-4 w-4 ${saved ? 'fill-primary text-primary' : ''}`}
                      />
                    )}
                    {saved ? 'Saved' : 'Save'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
