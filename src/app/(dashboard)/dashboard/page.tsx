'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CalendarCheck,
  Users,
  DollarSign,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Mail,
  Eye,
  Edit3,
  Sparkles,
  Star,
  MessageSquare,
  Check,
  X,
  Bookmark,
  CalendarDays,
  MapPin,
  Calendar,
  LayoutDashboard,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useAuthStore } from '@/lib/auth-store';
import { queryKeys } from '@/lib/query-keys';
import api from '@/lib/api';
import { EventCard, EventCardSkeleton } from '@/components/events/EventCard';

/* ------------------------------------------------------------------ */
/*  Organizer View                                                     */
/* ------------------------------------------------------------------ */

interface DashboardStats {
  totalEvents: number;
  totalEventsTrend: number;
  totalParticipants: number;
  totalParticipantsTrend: number;
  totalRevenue: number;
  totalRevenueTrend: number;
  pendingRequests: number;
  pendingRequestsTrend: number;
}

interface RecentEvent {
  id: string;
  title: string;
  startDate: string;
  participants: number;
  maxParticipants: number | null;
  status: string;
  location?: string;
  price?: number;
}

const statusColorMap: Record<string, string> = {
  PUBLISHED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  DRAFT: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  COMPLETED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

const statConfig = [
  {
    label: 'Total Events',
    key: 'totalEvents' as const,
    icon: CalendarCheck,
    trendKey: 'totalEventsTrend' as const,
  },
  {
    label: 'Total Participants',
    key: 'totalParticipants' as const,
    icon: Users,
    trendKey: 'totalParticipantsTrend' as const,
  },
  {
    label: 'Total Revenue',
    key: 'totalRevenue' as const,
    icon: DollarSign,
    trendKey: 'totalRevenueTrend' as const,
    format: (v: number) => `$${v.toLocaleString()}`,
  },
  {
    label: 'Pending Requests',
    key: 'pendingRequests' as const,
    icon: Clock,
    trendKey: 'pendingRequestsTrend' as const,
  },
];

function OrganizerView() {
  const [selectedEvent, setSelectedEvent] = useState<RecentEvent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: queryKeys.dashboard.stats,
    queryFn: async () => {
      const res = await api.get('/analytics/stats');
      return res.data.data;
    },
  });

  const { data: recentEvents } = useQuery<RecentEvent[]>({
    queryKey: queryKeys.dashboard.recentEvents,
    queryFn: async () => {
      const res = await api.get('/events?limit=5&sort=startDate&order=desc');
      return res.data.data?.events || [];
    },
  });

  const handleShowDetails = (event: RecentEvent) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back! Here is what is happening with your events.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statConfig.map((stat) => {
          const Icon = stat.icon;
          const value = stats?.[stat.key] ?? 0;
          const trend = stats?.[stat.trendKey] ?? 0;
          const isPositive = trend >= 0;
          const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;

          return (
            <Card key={stat.key}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.label}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stat.format ? stat.format(value) : value.toLocaleString()}
                </div>
                <p className="flex items-center text-xs text-muted-foreground">
                  <TrendIcon
                    className={`mr-1 h-3 w-3 ${isPositive ? 'text-green-600' : 'text-red-600'
                      }`}
                  />
                  <span
                    className={isPositive ? 'text-green-600' : 'text-red-600'}
                  >
                    {Math.abs(trend)}%
                  </span>
                  <span className="ml-1">vs last month</span>
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button asChild className='bg-purple-600 text-white hover:bg-purple-700 hover:text-white'>
          <Link href="/dashboard/events">
            <Plus className="mr-2 h-4 w-4" />
            Create New Event
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/invitations">
            <Mail className="mr-2 h-4 w-4" />
            View Invitations
          </Link>
        </Button>
      </div>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentEvents?.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground"
                  >
                    No events yet.
                  </TableCell>
                </TableRow>
              )}
              {recentEvents?.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>
                    {new Date(event.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {event.participants}
                    {event.maxParticipants
                      ? ` / ${event.maxParticipants}`
                      : ''}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        statusColorMap[event.status] || 'bg-gray-100 text-gray-700'
                      }
                    >
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleShowDetails(event)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )) ?? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground"
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Event Details Dialog */}
      {isDialogOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-all"
          onClick={() => setIsDialogOpen(false)}
        />
      )}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} modal={false}>
        <DialogContent className="max-w-md z-50">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription>
              Detailed information about your event.
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {new Date(selectedEvent.startDate).toLocaleDateString(
                    'en-US',
                    {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }
                  )}
                </span>
              </div>
              {selectedEvent.location && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedEvent.location}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>
                  {selectedEvent.participants}
                  {selectedEvent.maxParticipants
                    ? ` / ${selectedEvent.maxParticipants}`
                    : ''}{' '}
                  Participants
                </span>
              </div>
              {selectedEvent.price !== undefined && (
                <div className="flex items-center gap-3 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {selectedEvent.price === 0
                      ? 'Free'
                      : `$${selectedEvent.price}`}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                <Badge
                  variant="secondary"
                  className={statusColorMap[selectedEvent.status]}
                >
                  {selectedEvent.status}
                </Badge>
              </div>
              <div className="pt-4 flex justify-end">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  User View                                                          */
/* ------------------------------------------------------------------ */

interface JoinedEvent {
  id: string;
  title: string;
  slug: string;
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

interface Invitation {
  id: string;
  event: {
    id: string;
    title: string;
    startDate: string;
    location: string;
  };
  sender: { name: string };
  status: string;
  createdAt: string;
}

interface ReviewItem {
  id: string;
  event: { title: string };
  rating: number;
  comment: string | null;
  createdAt: string;
}

function UserView() {
  const queryClient = useQueryClient();

  const { data: joinedEvents, isLoading: joinedLoading } = useQuery<JoinedEvent[]>({
    queryKey: ['joined-events'],
    queryFn: async () => {
      const res = await api.get('/participations/my-events');
      return res.data.data?.events || [];
    },
  });

  const { data: savedEvents, isLoading: savedLoading } = useQuery<JoinedEvent[]>({
    queryKey: ['saved-events'],
    queryFn: async () => {
      const res = await api.get('/users/saved-events');
      return res.data.data?.events || [];
    },
  });

  const { data: invitations } = useQuery<Invitation[]>({
    queryKey: ['my-invitations'],
    queryFn: async () => {
      const res = await api.get('/invitations/received');
      return res.data.data?.invitations || [];
    },
  });

  const { data: reviews } = useQuery<ReviewItem[]>({
    queryKey: ['my-reviews'],
    queryFn: async () => {
      const res = await api.get('/reviews/my-reviews');
      return res.data.data?.reviews || [];
    },
  });

  const { data: aiRecs, isLoading: aiLoading } = useQuery<JoinedEvent[]>({
    queryKey: ['ai-recommendations'],
    queryFn: async () => {
      const res = await api.post('/ai/recommendations');
      return res.data.data?.events || [];
    },
  });

  const acceptMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch(`/invitations/${id}/respond`, { status: 'ACCEPTED' });
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-invitations'] }),
  });

  const declineMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch(`/invitations/${id}/respond`, { status: 'DECLINED' });
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-invitations'] }),
  });

  const upcomingJoined = joinedEvents
    ?.filter((e) => new Date(e.startDate) >= new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Your personal hub for events, invitations, and recommendations.
        </p>
      </div>

      {/* Joined Events */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-purple-600" />
          <h2 className="text-lg font-semibold">My Upcoming Events</h2>
        </div>
        {joinedLoading ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
          </div>
        ) : upcomingJoined && upcomingJoined.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {upcomingJoined.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              No upcoming events. <Link href="/events" className="text-purple-600 hover:underline">Browse events</Link>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Saved Events */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-purple-600" />
          <h2 className="text-lg font-semibold">Saved Events</h2>
        </div>
        {savedLoading ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            <EventCardSkeleton />
            <EventCardSkeleton />
          </div>
        ) : savedEvents && savedEvents.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {savedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-6 text-center text-sm text-muted-foreground">
              No saved events yet.
            </CardContent>
          </Card>
        )}
      </section>

      {/* Invitations */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Mail className="h-5 w-5 text-purple-600" />
          <h2 className="text-lg font-semibold">Invitations</h2>
        </div>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(!invitations || invitations.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No invitations.
                    </TableCell>
                  </TableRow>
                )}
                {invitations?.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">{inv.event.title}</TableCell>
                    <TableCell>{inv.sender.name}</TableCell>
                    <TableCell>{new Date(inv.event.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{inv.event.location}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{inv.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {inv.status === 'PENDING' && (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:bg-green-50"
                            onClick={() => acceptMutation.mutate(inv.id)}
                          >
                            <Check className="mr-1 h-3 w-3" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => declineMutation.mutate(inv.id)}
                          >
                            <X className="mr-1 h-3 w-3" />
                            Decline
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* My Reviews */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-purple-600" />
          <h2 className="text-lg font-semibold">My Reviews</h2>
        </div>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(!reviews || reviews.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No reviews yet.
                    </TableCell>
                  </TableRow>
                )}
                {reviews?.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell className="font-medium">{review.event.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {review.rating}/5
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {review.comment || 'No comment'}
                    </TableCell>
                    <TableCell>{new Date(review.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* AI Recommendations */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h2 className="text-lg font-semibold">AI Recommendations</h2>
        </div>
        {aiLoading ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
          </div>
        ) : aiRecs && aiRecs.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {aiRecs.slice(0, 3).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-6 text-center text-sm text-muted-foreground">
              No recommendations yet. Interact with more events to get personalized suggestions.
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role;

  if (role === 'ORGANIZER') return <OrganizerView />;
  return <UserView />;
}
