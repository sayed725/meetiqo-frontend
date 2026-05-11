'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarDays, MapPin, MailOpen, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Invitation {
  id: string;
  senderId: string;
  receiverId: string;
  eventId: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  message: string | null;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    avatar: string | null;
  };
  event: {
    id: string;
    title: string;
    slug: string;
    startDate: string;
    location: string | null;
  };
}

export default function InvitationsPage() {
  const queryClient = useQueryClient();

  // Fetch invitations
  const { data: invitations, isLoading } = useQuery<Invitation[]>({
    queryKey: ['invitations'],
    queryFn: async () => {
      const res = await api.get('/invitations/received');
      return res.data.data?.invitations || [];
    },
  });

  // Respond to invitation mutation
  const respondMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'ACCEPTED' | 'DECLINED' }) => {
      const res = await api.patch(`/invitations/${id}/respond`, { status });
      return res.data;
    },
    onSuccess: (data, variables) => {
      toast.success(`Invitation ${variables.status.toLowerCase()} successfully`);
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      queryClient.invalidateQueries({ queryKey: ['joined-events'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to respond to invitation');
    },
  });

  const handleRespond = (id: string, status: 'ACCEPTED' | 'DECLINED') => {
    respondMutation.mutate({ id, status });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Invitations</h2>
          <p className="text-muted-foreground">Manage your event invitations.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="flex flex-col">
              <CardHeader className="flex flex-row items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter className="gap-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const pendingCount = invitations?.filter((inv) => inv.status === 'PENDING').length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            Invitations
            {pendingCount > 0 && (
              <Badge variant="default" className="rounded-full">
                {pendingCount} new
              </Badge>
            )}
          </h2>
          <p className="text-muted-foreground">Manage your event invitations and requests.</p>
        </div>
      </div>

      {!invitations || invitations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <MailOpen className="h-10 w-10 text-primary" />
          </div>
          <h3 className="mt-6 text-xl font-semibold">No invitations yet</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            When you receive an invitation to an event, it will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {invitations.map((invitation) => (
            <Card key={invitation.id} className="flex flex-col relative overflow-hidden transition-all hover:shadow-md">
              {/* Status Indicator Line */}
              <div 
                className={`absolute top-0 left-0 w-1 h-full ${
                  invitation.status === 'PENDING' ? 'bg-blue-500' :
                  invitation.status === 'ACCEPTED' ? 'bg-green-500' : 'bg-red-500'
                }`} 
              />
              
              <CardHeader className="flex flex-row items-start gap-4 pb-4">
                <Avatar className="h-12 w-12 border">
                  <AvatarImage src={invitation.sender.avatar || undefined} alt={invitation.sender.name} />
                  <AvatarFallback>{invitation.sender.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-base truncate">{invitation.sender.name}</span>
                    <Badge 
                      variant={
                        invitation.status === 'PENDING' ? 'secondary' :
                        invitation.status === 'ACCEPTED' ? 'default' : 'destructive'
                      }
                      className="shrink-0"
                    >
                      {invitation.status}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Invited you {format(new Date(invitation.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 space-y-4">
                <div className="rounded-lg bg-muted/50 p-3 space-y-3">
                  <div className="font-medium truncate">{invitation.event.title}</div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 shrink-0" />
                      <span>{format(new Date(invitation.event.startDate), 'EEEE, MMMM d, yyyy • h:mm a')}</span>
                    </div>
                    {invitation.event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span className="truncate">{invitation.event.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {invitation.message && (
                  <div className="text-sm border-l-2 pl-3 py-1 text-muted-foreground italic">
                    "{invitation.message}"
                  </div>
                )}
              </CardContent>

              <CardFooter className="pt-4 border-t gap-3">
                {invitation.status === 'PENDING' ? (
                  <>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      disabled={respondMutation.isPending}
                      onClick={() => handleRespond(invitation.id, 'DECLINED')}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Decline
                    </Button>
                    <Button 
                      className="flex-1"
                      disabled={respondMutation.isPending}
                      onClick={() => handleRespond(invitation.id, 'ACCEPTED')}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Accept
                    </Button>
                  </>
                ) : (
                  <Button variant="secondary" className="w-full" disabled>
                    {invitation.status === 'ACCEPTED' ? 'Invitation Accepted' : 'Invitation Declined'}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
