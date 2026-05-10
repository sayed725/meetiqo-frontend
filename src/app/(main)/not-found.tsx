import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-muted-foreground">Event not found.</p>
      <Link href="/events">
        <Button className="mt-6">Browse Events</Button>
      </Link>
    </div>
  );
}
