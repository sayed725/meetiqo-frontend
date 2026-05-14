'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Users, ArrowRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/auth-store';
import { toast } from 'sonner';

function MockEventCard({
  title,
  location,
  attendees,
  date,
  delay,
}: {
  title: string;
  location: string;
  attendees: string;
  date: string;
  delay: string;
}) {
  return (
    <div
      className={`w-72 rounded-xl border bg-card/90 p-4 shadow-lg backdrop-blur-sm ${delay}`}
    >
      <div className="mb-3 h-24 rounded-lg bg-gradient-to-br from-violet-100 to-blue-100 dark:from-violet-950 dark:to-blue-950" />
      <h4 className="mb-1 text-sm font-semibold">{title}</h4>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {date}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {location}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
        <Users className="h-3 w-3" />
        {attendees}
      </div>
    </div>
  );
}

export function HeroSection() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const handleCreateEvent = () => {
    if (!user) {
      toast.error('Please login to create an event');
      return;
    }

    if (user.role !== 'ORGANIZER') {
      toast.error('Be a organizer to create event');
      return;
    }

    router.push('/events/create');
  };

  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden pt-16">
      {/* Gradient blob */}
      <div
        className="pointer-events-none absolute -left-32 top-0 h-[600px] w-[600px] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            'radial-gradient(circle at 30% 30%, rgba(124, 58, 237, 0.4), transparent 50%)',
        }}
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-0 h-[500px] w-[500px] rounded-full opacity-20 blur-3xl"
        style={{
          background:
            'radial-gradient(circle at 70% 70%, rgba(59, 130, 246, 0.4), transparent 50%)',
        }}
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-12 px-4 py-20 sm:px-6 lg:flex-row lg:px-8 lg:py-28">
        {/* Text */}
        <div className="max-w-xl text-center lg:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Smart Meetups.
            <br />
            <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
              Real Connections.
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Discover events that match your interests, meet like-minded people, and
            build your community with AI-powered recommendations.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link href="/events">
              <Button size="lg" className="w-full gap-2 sm:w-auto bg-purple-600 text-white hover:bg-purple-700 hover:text-white">
                Explore Events
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full gap-2 sm:w-auto"
              onClick={handleCreateEvent}
            >
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </div>
        </div>

        {/* Floating cards */}
        <div className="relative hidden lg:flex lg:h-[400px] lg:w-[400px] lg:items-center lg:justify-center">
          <div className="animate-float absolute -top-4 right-8">
            <MockEventCard
              title="Tech Startup Networking"
              location="San Francisco"
              attendees="120 attending"
              date="Jun 15"
              delay=""
            />
          </div>
          <div className="animate-float-delayed absolute -left-8 top-20">
            <MockEventCard
              title="AI Workshop 2024"
              location="New York"
              attendees="85 attending"
              date="Jun 20"
              delay=""
            />
          </div>
          <div className="animate-float-slow absolute bottom-0 right-0">
            <MockEventCard
              title="Creative Design Meetup"
              location="London"
              attendees="200 attending"
              date="Jun 22"
              delay=""
            />
          </div>
        </div>
      </div>
    </section>
  );
}
