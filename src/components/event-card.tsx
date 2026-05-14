import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

interface EventCardProps {
  event?: {
    id: string;
    slug: string;
    title: string;
    startDate: string;
    location: string;
    category: string;
    price: number;
    isPaid: boolean;
    bannerImage?: string | null;
    organizer?: {
      name: string;
      avatar?: string | null;
    };
    _count?: {
      participations: number;
    };
  };
  isLoading?: boolean;
  priority?: boolean;
}

export function EventCard({ event, isLoading, priority }: EventCardProps) {
  if (isLoading || !event) {
    return (
      <Card className="h-full overflow-hidden">
        <Skeleton className="aspect-video w-full shrink-0" />
        <CardContent className="p-4 flex flex-col gap-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </CardContent>
      </Card>
    );
  }

  const date = new Date(event.startDate);
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const day = date.getDate();

  return (
    <Link href={`/events/${event.slug}`} className="block h-full">
      <Card className="group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative aspect-video bg-muted shrink-0">
          {event.bannerImage ? (
            <Image
              src={event.bannerImage}
              alt={event.title}
              fill
              priority={priority}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-100 to-blue-100 dark:from-violet-950 dark:to-blue-950">
              <Calendar className="h-10 w-10 text-muted-foreground/50" />
            </div>
          )}
          <div className="absolute left-3 top-3">
            <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-background/90 text-center shadow-sm backdrop-blur-sm">
              <span className="text-xs font-bold uppercase text-primary">{month}</span>
              <span className="text-lg font-bold leading-none">{day}</span>
            </div>
          </div>
          <div className="absolute right-3 top-3">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
              {event.isPaid ? `$${event.price}` : 'Free'}
            </Badge>
          </div>
        </div>
        <CardContent className="flex flex-1 flex-col p-4">
          <div className="mb-2">
            <Badge variant="outline" className="text-xs">
              {event.category}
            </Badge>
          </div>
          <h3 className="mb-2 line-clamp-2 min-h-[2.5rem] font-semibold leading-tight group-hover:text-primary">
            {event.title}
          </h3>
          <div className="mb-auto flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={event.organizer?.avatar || undefined} />
                <AvatarFallback className="text-xs">
                  {event.organizer?.name?.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                {event.organizer?.name}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span>{event._count?.participations || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
