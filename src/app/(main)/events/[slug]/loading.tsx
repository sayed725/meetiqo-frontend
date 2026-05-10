import { Skeleton } from '@/components/ui/skeleton';

export default function EventDetailLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Banner skeleton */}
      <Skeleton className="h-[300px] w-full sm:h-[400px]" />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main content skeleton */}
          <div className="min-w-0 flex-[0.65] space-y-6">
            <Skeleton className="h-8 w-full max-w-md" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="space-y-4">
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          </div>

          {/* Sidebar skeleton */}
          <aside className="flex-[0.35]">
            <Skeleton className="h-80 w-full rounded-lg" />
          </aside>
        </div>
      </div>
    </div>
  );
}
