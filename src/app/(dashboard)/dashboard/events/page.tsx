'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Plus,
  Eye,
  Edit3,
  Users,
  DollarSign,
  ImageIcon,
  Calendar,
  MapPin,
  Trash2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import api from '@/lib/api';

const categories = [
  'TECH',
  'MUSIC',
  'BUSINESS',
  'HEALTH',
  'SPORTS',
  'ART',
  'EDUCATION',
  'SOCIAL',
  'OTHER',
];

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  bannerImage: z.string().optional(),
  category: z.string().min(1),
  type: z.enum(['PUBLIC', 'PRIVATE']),
  status: z.enum(['DRAFT', 'PUBLISHED']),
  price: z.coerce.number().min(0),
  isPaid: z.boolean().default(false),
  location: z.string().min(1, 'Location is required'),
  address: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  maxParticipants: z.coerce.number().min(1).optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

interface DashboardEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  bannerImage: string | null;
  startDate: string;
  endDate: string | null;
  location: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  status: string;
  type: string;
  category: string;
  price: number;
  isPaid: boolean;
  maxParticipants: number | null;
  _count?: {
    participations: number;
  };
}

const statusColorMap: Record<string, string> = {
  PUBLISHED: 'bg-green-100 text-green-700',
  DRAFT: 'bg-yellow-100 text-yellow-700',
  CANCELLED: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
};

export default function MyEventsPage() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('PUBLISHED');
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [selectedEventForView, setSelectedEventForView] = useState<DashboardEvent | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      type: 'PUBLIC',
      status: 'DRAFT',
      price: 0,
      isPaid: false,
      category: 'OTHER',
    },
  });

  const isPaid = watch('isPaid');

  const { data: events, isLoading } = useQuery<DashboardEvent[]>({
    queryKey: ['my-events', activeTab],
    queryFn: async () => {
      const res = await api.get(`/events/me/all?status=${activeTab}`);
      return res.data.data?.events || [];
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setEditingEventId(null);
      reset({
        title: '',
        description: '',
        bannerImage: '',
        category: 'OTHER',
        type: 'PUBLIC',
        status: 'DRAFT',
        price: 0,
        isPaid: false,
        location: '',
        address: '',
        startDate: '',
        endDate: '',
        maxParticipants: undefined,
      });
    }
  };

  const handleEdit = (event: DashboardEvent) => {
    setEditingEventId(event.id);
    reset({
      title: event.title,
      description: event.description || '',
      bannerImage: event.bannerImage || '',
      category: event.category,
      type: event.type as any,
      status: event.status as any,
      price: event.price,
      isPaid: event.isPaid,
      location: event.location,
      address: event.address || '',
      startDate: new Date(event.startDate).toISOString().slice(0, 16),
      endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
      maxParticipants: event.maxParticipants || undefined,
    });
    setOpen(true);
  };

  const createMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      const res = await api.post('/events', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-events'] });
      handleOpenChange(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: EventFormData }) => {
      const res = await api.put(`/events/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-events'] });
      handleOpenChange(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/events/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-events'] });
      toast.success('Event deleted successfully');
    },
  });

  const onSubmit = (data: EventFormData) => {
    const payload = { ...data };
    if (!payload.bannerImage) delete payload.bannerImage;
    if (!payload.address) delete payload.address;
    if (!payload.endDate) delete payload.endDate;
    if (!payload.maxParticipants) delete payload.maxParticipants;
    
    if (payload.startDate) {
      payload.startDate = new Date(payload.startDate).toISOString();
    }
    if (payload.endDate) {
      payload.endDate = new Date(payload.endDate).toISOString();
    }

    if (editingEventId) {
      updateMutation.mutate({ id: editingEventId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const revenue = (event: DashboardEvent) => {
    const count = event._count?.participations || 0;
    return event.isPaid ? count * event.price : 0;
  };

  const handleViewDetails = (event: DashboardEvent) => {
    setSelectedEventForView(event);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6 ">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Events</h1>
          <p className="text-sm text-muted-foreground">
            Manage and track all your events.
          </p>
        </div>
        
        {/* Create/Edit Modal with manual backdrop */}
        {open && (
          <div 
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-all"
            onClick={() => handleOpenChange(false)}
          />
        )}
        <Dialog open={open} onOpenChange={handleOpenChange} modal={false}>
          <DialogTrigger asChild>
            <Button className='bg-purple-600 text-white hover:bg-purple-700 hover:text-white'>
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto z-50">
            <DialogHeader>
              <DialogTitle>{editingEventId ? 'Edit Event' : 'Create New Event'}</DialogTitle>
              <DialogDescription>
                {editingEventId
                  ? 'Update the details of your event below.'
                  : 'Fill out the form below to create a new event.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input id="title" {...register('title')} />
                  {errors.title && (
                    <p className="text-xs text-red-500">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    {...register('description')}
                  />
                  {errors.description && (
                    <p className="text-xs text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="bannerImage">Banner Image URL</Label>
                  <Input
                    id="bannerImage"
                    placeholder="https://..."
                    {...register('bannerImage')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={watch('category')}
                    onValueChange={(v) => setValue('category', v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={watch('type')}
                    onValueChange={(v: 'PUBLIC' | 'PRIVATE') =>
                      setValue('type', v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PUBLIC">Public</SelectItem>
                      <SelectItem value="PRIVATE">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={watch('status')}
                    onValueChange={(v: 'DRAFT' | 'PUBLISHED') =>
                      setValue('status', v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    {...register('startDate')}
                  />
                  {errors.startDate && (
                    <p className="text-xs text-red-500">
                      {errors.startDate.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    {...register('endDate')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" {...register('location')} />
                  {errors.location && (
                    <p className="text-xs text-red-500">
                      {errors.location.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address (optional)</Label>
                  <Input id="address" {...register('address')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    {...register('maxParticipants')}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      id="isPaid"
                      type="checkbox"
                      className="h-4 w-4"
                      {...register('isPaid')}
                    />
                    <Label htmlFor="isPaid">Paid Event</Label>
                  </div>
                </div>

                {isPaid && (
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      {...register('price')}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className='bg-purple-600 text-white hover:bg-purple-700 hover:text-white' disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending
                    ? (editingEventId ? 'Updating...' : 'Creating...')
                    : (editingEventId ? 'Update Event' : 'Create Event')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Details Modal with manual backdrop */}
      {isDetailsOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-all"
          onClick={() => setIsDetailsOpen(false)}
        />
      )}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen} modal={false}>
        <DialogContent className="max-w-md z-50">
          <DialogHeader>
            <DialogTitle>{selectedEventForView?.title}</DialogTitle>
            <DialogDescription>
              Detailed information about your event.
            </DialogDescription>
          </DialogHeader>
          {selectedEventForView && (
            <div className="space-y-4 pt-4">
              {selectedEventForView.bannerImage && (
                <div className="relative h-40 w-full overflow-hidden rounded-md">
                  <Image
                    src={selectedEventForView.bannerImage}
                    alt={selectedEventForView.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {new Date(selectedEventForView.startDate).toLocaleDateString(
                    'en-US',
                    {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }
                  )}
                </span>
              </div>
              {selectedEventForView.location && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedEventForView.location}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>
                  {selectedEventForView._count?.participations || 0}
                  {selectedEventForView.maxParticipants
                    ? ` / ${selectedEventForView.maxParticipants}`
                    : ''}{' '}
                  Participants
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>
                  {selectedEventForView.price === 0
                    ? 'Free'
                    : `$${selectedEventForView.price}`}
                </span>
              </div>
              <div className="pt-2">
                <p className="text-sm text-muted-foreground line-clamp-4">
                  {selectedEventForView.description}
                </p>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <Button variant="outline" asChild>
                   <Link href={`/events/${selectedEventForView.slug}`} target="_blank">
                     Public Page
                   </Link>
                </Button>
                <Button className='bg-purple-600 text-white hover:bg-purple-700 hover:text-white' onClick={() => setIsDetailsOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className='bg-muted/50'>
          <TabsTrigger value="PUBLISHED">Published</TabsTrigger>
          <TabsTrigger value="DRAFT">Draft</TabsTrigger>
          <TabsTrigger value="COMPLETED">Completed</TabsTrigger>
          <TabsTrigger value="CANCELLED">Cancelled</TabsTrigger>
        </TabsList>

        {(['PUBLISHED', 'DRAFT', 'COMPLETED', 'CANCELLED'] as const).map(
          (status) => (
            <TabsContent key={status} value={status}>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading && (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center text-muted-foreground"
                        >
                          Loading...
                        </TableCell>
                      </TableRow>
                    )}
                    {!isLoading && events?.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center text-muted-foreground"
                        >
                          No {status.toLowerCase()} events found.
                        </TableCell>
                      </TableRow>
                    )}
                    {events?.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          {event.bannerImage ? (
                            <Image
                              src={event.bannerImage}
                              alt={event.title}
                              width={64}
                              height={40}
                              className="h-10 w-16 rounded object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-16 items-center justify-center rounded bg-muted">
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium max-w-[200px] truncate">
                          {event.title}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {new Date(event.startDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="max-w-[120px] truncate">
                              {event.location}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            {event._count?.participations || 0}
                            {event.maxParticipants
                              ? ` / ${event.maxParticipants}`
                              : ''}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={
                              statusColorMap[event.status] ||
                              'bg-gray-100 text-gray-700'
                            }
                          >
                            {event.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <DollarSign className="h-3 w-3 text-muted-foreground" />
                            {revenue(event).toFixed(2)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleViewDetails(event)}>
                              <Eye className="h-4 w-4 text-purple-600" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(event)}>
                              <Edit3 className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                              <Link
                                href={`/dashboard/events/${event.id}/participants`}
                              >
                                <Users className="h-4 w-4 text-green-600" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10"
                              disabled={deleteMutation.isPending}
                              onClick={() => {
                                toast.error('Delete Event?', {
                                  description: 'Are you sure you want to delete this event? This action cannot be undone.',
                                  action: {
                                    label: 'Delete',
                                    onClick: () => deleteMutation.mutate(event.id),
                                  },
                                  cancel: {
                                    label: 'Cancel',
                                    onClick: () => {},
                                  },
                                });
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          )
        )}
      </Tabs>
    </div>
  );
}
