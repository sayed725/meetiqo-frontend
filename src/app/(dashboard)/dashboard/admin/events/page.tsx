'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Eye,
  Globe,
  EyeOff,
  Trash2,
  CalendarDays,
  MapPin,
  Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import api from '@/lib/api';

interface AdminEvent {
  id: string;
  title: string;
  slug: string;
  bannerImage: string | null;
  startDate: string;
  location: string;
  status: string;
  category: string;
  organizer: { name: string };
  _count?: { participations: number };
}

const statusColorMap: Record<string, string> = {
  PUBLISHED: 'bg-green-100 text-green-700',
  DRAFT: 'bg-yellow-100 text-yellow-700',
  CANCELLED: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
};

export default function EventModerationPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [deleteTarget, setDeleteTarget] = useState<AdminEvent | null>(null);
  const queryClient = useQueryClient();

  const { data: events, isLoading } = useQuery<AdminEvent[]>({
    queryKey: ['admin-events', statusFilter],
    queryFn: async () => {
      const params = statusFilter === 'ALL' ? '' : `?status=${statusFilter}`;
      const res = await api.get(`/admin/events${params}`);
      return res.data.data?.events || [];
    },
  });

  const publishMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.put(`/admin/events/${id}/publish`);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-events'] }),
  });

  const unpublishMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.put(`/admin/events/${id}/unpublish`);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-events'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/events/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      setDeleteTarget(null);
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Event Moderation</h1>
        <p className="text-sm text-muted-foreground">
          Review, publish, unpublish, or remove platform events.
        </p>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Events Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Organizer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Participants</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {!isLoading && events?.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No events found.
                </TableCell>
              </TableRow>
            )}
            {events?.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium max-w-[200px] truncate">
                  {event.title}
                </TableCell>
                <TableCell>{event.organizer.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <CalendarDays className="h-3 w-3 text-muted-foreground" />
                    {new Date(event.startDate).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="max-w-[120px] truncate">{event.location}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    {event._count?.participations || 0}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{event.category}</Badge>
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
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" title="View" asChild>
                      <Link href={`/events/${event.slug}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    {event.status !== 'PUBLISHED' ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Publish"
                        onClick={() => publishMutation.mutate(event.id)}
                      >
                        <Globe className="h-4 w-4 text-green-600" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Unpublish"
                        onClick={() => unpublishMutation.mutate(event.id)}
                      >
                        <EyeOff className="h-4 w-4 text-yellow-600" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Delete"
                      onClick={() => setDeleteTarget(event)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.title}</strong>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
