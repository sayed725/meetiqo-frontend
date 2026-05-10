'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Check,
  X,
  UserMinus,
  Mail,
  Send,
  Users,
  UserCheck,
  UserX,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import api from '@/lib/api';

interface Participant {
  id: string;
  userId: string;
  eventId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
}

export default function ManageParticipantsPage() {
  const params = useParams();
  const eventId = params.id as string;
  const queryClient = useQueryClient();
  const [inviteEmail, setInviteEmail] = useState('');

  const { data: participants, isLoading } = useQuery<Participant[]>({
    queryKey: ['event-participants', eventId],
    queryFn: async () => {
      const res = await api.get(`/events/${eventId}/participants`);
      return res.data.data?.participants || [];
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (participantId: string) => {
      const res = await api.put(`/participants/${participantId}/approve`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['event-participants', eventId],
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (participantId: string) => {
      const res = await api.put(`/participants/${participantId}/reject`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['event-participants', eventId],
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (participantId: string) => {
      const res = await api.delete(`/participants/${participantId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['event-participants', eventId],
      });
    },
  });

  const inviteMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await api.post(`/events/${eventId}/invite`, { email });
      return res.data;
    },
    onSuccess: () => {
      setInviteEmail('');
      queryClient.invalidateQueries({
        queryKey: ['event-participants', eventId],
      });
    },
  });

  const pending =
    participants?.filter((p) => p.status === 'PENDING') || [];
  const approved =
    participants?.filter((p) => p.status === 'APPROVED') || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manage Participants</h1>
        <p className="text-sm text-muted-foreground">
          Review requests and manage attendees for this event.
        </p>
      </div>

      {/* Invite */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Mail className="h-4 w-4" />
            Invite by Email
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (inviteEmail.trim()) {
                inviteMutation.mutate(inviteEmail.trim());
              }
            }}
            className="flex gap-2"
          >
            <div className="flex-1">
              <Label htmlFor="inviteEmail" className="sr-only">
                Email
              </Label>
              <Input
                id="inviteEmail"
                type="email"
                placeholder="participant@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              disabled={inviteMutation.isPending || !inviteEmail.trim()}
            >
              <Send className="mr-2 h-4 w-4" />
              {inviteMutation.isPending ? 'Sending...' : 'Invite'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <UserCheck className="h-4 w-4" />
            Pending Requests
            <Badge variant="secondary">{pending.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && pending.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground"
                  >
                    No pending requests.
                  </TableCell>
                </TableRow>
              )}
              {pending.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.user.name}</TableCell>
                  <TableCell>{p.user.email}</TableCell>
                  <TableCell>
                    {new Date(p.joinedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:bg-green-50 hover:text-green-700"
                        onClick={() => approveMutation.mutate(p.id)}
                        disabled={approveMutation.isPending}
                      >
                        <Check className="mr-1 h-3 w-3" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => rejectMutation.mutate(p.id)}
                        disabled={rejectMutation.isPending}
                      >
                        <X className="mr-1 h-3 w-3" />
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Approved Participants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4" />
            Approved Participants
            <Badge variant="secondary">{approved.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && approved.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground"
                  >
                    No approved participants yet.
                  </TableCell>
                </TableRow>
              )}
              {approved.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.user.name}</TableCell>
                  <TableCell>{p.user.email}</TableCell>
                  <TableCell>
                    {new Date(p.joinedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => removeMutation.mutate(p.id)}
                      disabled={removeMutation.isPending}
                    >
                      <UserMinus className="mr-1 h-3 w-3" />
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
