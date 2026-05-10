import { Sparkles, Users, Calendar, MapPin } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left Panel — Decorative */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 p-12 text-white lg:flex">
        <div className="z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="h-8 w-8" />
            <span className="text-2xl font-bold tracking-tight">Meetiqo</span>
          </div>
        </div>

        <div className="z-10 space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Smart Meetups.<br />Real Connections.
          </h1>
          <p className="max-w-md text-lg text-white/80">
            Discover events that match your interests, meet like-minded people, and build your community with AI-powered recommendations.
          </p>

          <div className="flex gap-6 pt-4">
            <div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
              <Users className="h-5 w-5" />
              <span className="text-sm font-medium">10K+ Members</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
              <Calendar className="h-5 w-5" />
              <span className="text-sm font-medium">500+ Events</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
              <MapPin className="h-5 w-5" />
              <span className="text-sm font-medium">50+ Cities</span>
            </div>
          </div>
        </div>

        <div className="z-10 text-sm text-white/60">
          &copy; {new Date().getFullYear()} Meetiqo. All rights reserved.
        </div>

        {/* Background decoration */}
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
      </div>

      {/* Right Panel — Form */}
      <div className="flex w-full flex-col items-center justify-center bg-background p-6 lg:w-1/2 lg:p-12">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
