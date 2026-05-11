'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarDays, Bookmark, MailOpen, MessageSquare, Mail, ShieldAlert } from 'lucide-react';

interface ProfileStats {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    savedEvents: number;
    receivedInvitations: number;
    reviews: number;
  };
}

export default function ProfilePage() {
  const { data: profile, isLoading, error } = useQuery<ProfileStats>({
    queryKey: ['profile-stats'],
    queryFn: async () => {
      const res = await api.get('/users/profile');
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl pb-12">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
          <p className="text-muted-foreground">View your account details and activity metrics.</p>
        </div>
        <Card>
          <CardContent className="p-8 flex items-center gap-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-3">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </CardContent>
        </Card>
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Failed to load profile data.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">View your account details and activity metrics.</p>
      </div>

      <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-card to-muted/50">
        <CardContent className="p-8 sm:p-10 flex flex-col sm:flex-row items-center sm:items-start gap-8">
          <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
            <AvatarImage src={profile.avatar || undefined} alt={profile.name} />
            <AvatarFallback className="text-4xl bg-primary/10 text-primary">
              {profile.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col items-center sm:items-start space-y-4 text-center sm:text-left flex-1">
            <div>
              <h3 className="text-3xl font-bold">{profile.name}</h3>
              <div className="flex items-center gap-2 mt-2 text-muted-foreground justify-center sm:justify-start">
                <Mail className="h-4 w-4" />
                <span>{profile.email}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
              <Badge variant={profile.role === 'ADMIN' ? 'destructive' : 'default'} className="px-3 py-1">
                {profile.role === 'ADMIN' && <ShieldAlert className="w-3 h-3 mr-1" />}
                {profile.role}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground bg-background/50 px-3 py-1.5 rounded-full border">
                <CalendarDays className="mr-2 h-4 w-4" />
                Joined {format(new Date(profile.createdAt), 'MMMM d, yyyy')}
              </div>
            </div>
            {profile.updatedAt && (
              <p className="text-xs text-muted-foreground pt-2">
                Last updated: {format(new Date(profile.updatedAt), 'MMMM d, yyyy h:mm a')}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Events</CardTitle>
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{profile._count.savedEvents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Events you have bookmarked
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invitations</CardTitle>
            <MailOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{profile._count.receivedInvitations}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Invitations received from organizers
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{profile._count.reviews}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total reviews left on events
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
