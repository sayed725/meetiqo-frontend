import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <Skeleton className="h-12 w-48" />
      <div className="flex w-full max-w-2xl flex-col gap-4">
        <Skeleton className="h-64 w-full rounded-xl" />
        <div className="flex gap-4">
          <Skeleton className="h-40 w-1/3 rounded-xl" />
          <Skeleton className="h-40 w-1/3 rounded-xl" />
          <Skeleton className="h-40 w-1/3 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
