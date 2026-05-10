import { Skeleton } from '@/components/ui/skeleton';
import { EventCardSkeleton } from '@/components/events/EventCard';

export default function EventsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="mt-2 h-5 w-96" />

      <div className="mt-8 flex gap-8">
        {/* Sidebar skeleton */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 space-y-6">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        </aside>

        {/* Grid skeleton */}
        <div className="min-w-0 flex-1">
          <Skeleton className="mb-4 h-5 w-48" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
