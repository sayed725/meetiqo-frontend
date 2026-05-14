import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Users, Star, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface EventSummary {
  id: string;
  slug: string;
  title: string;
  bannerImage?: string | null;
  organizer: {
    name: string;
    avatar?: string | null;
  };
  startDate: string;
  location: string;
  price: number;
  isPaid: boolean;
  category: string;
  averageRating?: number | null;
  participantCount: number;
  type: 'PUBLIC' | 'PRIVATE';
}

const categoryGradients: Record<string, string> = {
  TECH: 'from-blue-500/20 to-cyan-500/20',
  MUSIC: 'from-pink-500/20 to-rose-500/20',
  BUSINESS: 'from-emerald-500/20 to-teal-500/20',
  HEALTH: 'from-green-500/20 to-lime-500/20',
  SPORTS: 'from-orange-500/20 to-amber-500/20',
  ART: 'from-purple-500/20 to-violet-500/20',
  EDUCATION: 'from-indigo-500/20 to-blue-500/20',
  SOCIAL: 'from-red-500/20 to-orange-500/20',
  OTHER: 'from-slate-500/20 to-gray-500/20',
};

// const categoryColors: Record<string, string> = {
//   TECH: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
//   MUSIC: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
//   BUSINESS: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
//   HEALTH: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
//   SPORTS: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
//   ART: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
//   EDUCATION: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
//   SOCIAL: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
//   OTHER: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400',
// };

function formatCategory(category: string): string {
  if (!category) return '';
  return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'h-3.5 w-3.5',
            i < Math.round(rating)
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-muted text-muted'
          )}
        />
      ))}
      <span className="ml-1 text-xs font-medium text-muted-foreground">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

function formatEventDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

interface EventCardProps {
  event: EventSummary;
}

export function EventCard({ event }: EventCardProps) {
  const gradient =
    categoryGradients[event.category] || categoryGradients.OTHER;

  return (
    <Link href={`/events/${event.slug}`} className="block w-full h-full max-w-[380px] min-w-[300px] shrink-0">
      <Card className="group w-full h-full max-w-[380px] overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg flex flex-col">
        {/* Banner */}
        <div className="relative h-[160px] w-full bg-muted">
          {event.bannerImage ? (
            <Image
              src={event.bannerImage}
              alt={event.title}
              fill
              priority
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="320px"
            />
          ) : (
            <div
              className={cn(
                'flex h-full w-full items-center justify-center bg-gradient-to-br',
                gradient
              )}
            >
              <Calendar className="h-10 w-10 text-muted-foreground/40" />
            </div>
          )}

          {/* PRIVATE badge */}
          {event.type === 'PRIVATE' && (
            <div className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-background/90 px-2 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm">
              <Lock className="h-3 w-3" />
              Private
            </div>
          )}

          {/* Price badge */}
          <div className="absolute right-2 top-2">
            {event.isPaid ? (
              <Badge className="bg-purple-600 text-white hover:bg-purple-700">
                ${event.price}
              </Badge>
            ) : (
              <Badge className="bg-green-600 text-white hover:bg-green-700">
                Free
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="flex-1 flex flex-col p-4">
          <div className="flex flex-col space-y-3 flex-1">
            {/* Category chip */}
            <div>
              <Badge
                variant="secondary"
                className={cn(
                  "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                 
                )}
              >
                {formatCategory(event.category)}
              </Badge>
            </div>

            {/* Title */}
            <h3 className="line-clamp-2 text-base font-medium leading-snug group-hover:text-primary">
              {event.title}
            </h3>

            {/* Organizer */}
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={event.organizer.avatar || undefined} />
                <AvatarFallback className="text-[10px]">
                  {event.organizer.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                {event.organizer.name}
              </span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span>{formatEventDate(event.startDate)}</span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/50">
            <div className="flex items-center gap-3">
              {event.averageRating != null && event.averageRating > 0 && (
                <StarRating rating={event.averageRating} />
              )}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                <span>{event.participantCount}</span>
              </div>
            </div>
            <span className="text-xs font-medium text-primary group-hover:underline">
              View Details
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="w-full h-full max-w-[380px] min-w-[300px] shrink-0">
      <Card className="w-full h-full max-w-[380px] overflow-hidden flex flex-col">
        <Skeleton className="h-[160px] w-full" />
        <CardContent className="flex-1 flex flex-col p-4">
          <div className="flex flex-col space-y-3 flex-1">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/50">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-24" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
