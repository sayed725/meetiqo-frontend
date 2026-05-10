'use client';

import {
  Target,
  Users,
  Zap,
  Shield,
  Rocket,
  Heart,
  Globe,
  Calendar,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const storyTimeline = [
  { year: '2022', title: 'The Idea', desc: 'Meetiqo was born from frustration with scattered event platforms.' },
  { year: '2023', title: 'First Launch', desc: 'Beta launch with 500 users and AI description generator.' },
  { year: '2024', title: 'Growth', desc: 'Reached 50K users, added smart recommendations and planner.' },
  { year: '2025', title: 'Today', desc: 'Global community of organizers and attendees.' },
];

const team = [
  {
    name: 'Sarah Chen',
    role: 'CEO & Co-Founder',
    bio: 'Former PM at Eventbrite. Passionate about community-driven experiences.',
    initial: 'SC',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    name: 'Marcus Johnson',
    role: 'CTO & Co-Founder',
    bio: 'Full-stack engineer with a love for AI and real-time systems.',
    initial: 'MJ',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Aisha Patel',
    role: 'Head of Design',
    bio: 'Previously led UX at Figma. Believes in simple, beautiful interfaces.',
    initial: 'AP',
    color: 'bg-pink-100 text-pink-700',
  },
  {
    name: 'David Kim',
    role: 'Head of Community',
    bio: 'Built communities at Discord. Here to make every event unforgettable.',
    initial: 'DK',
    color: 'bg-emerald-100 text-emerald-700',
  },
];

const values = [
  {
    title: 'Community First',
    desc: 'We believe real connections happen in person. Our platform exists to make that easier.',
    icon: Users,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    title: 'AI-Powered',
    desc: 'Smart tools that help organizers plan better and attendees discover events they will love.',
    icon: Zap,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    title: 'Trust & Safety',
    desc: 'Verified organizers, transparent reviews, and secure payments.',
    icon: Shield,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    title: 'Open & Inclusive',
    desc: 'Events for everyone. From tech meetups to art walks to neighborhood potlucks.',
    icon: Globe,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-24 pb-24">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 px-4 py-24 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <Rocket className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Our Mission
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/90">
            To bring people together through memorable, well-organized events.
            We use AI to remove friction from event planning so organizers can
            focus on what matters — the experience.
          </p>
        </div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      </section>

      {/* Our Story */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">Our Story</h2>
            <p className="mt-4 text-muted-foreground">
              Meetiqo started when our founders struggled to find local tech meetups
              that matched their interests. Existing platforms felt cluttered, impersonal,
              and lacked tools to help organizers succeed.
            </p>
            <p className="mt-4 text-muted-foreground">
              We set out to build something different — a platform that feels like a
              community, powered by AI that actually helps. Today, Meetiqo hosts thousands
              of events across the world, from intimate workshops to massive conferences.
            </p>
          </div>

          <div className="relative pl-6">
            <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-8">
              {storyTimeline.map((item, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {item.year.slice(-2)}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground">{item.year}</span>
                    <h3 className="mt-1 font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Meet the Team</h2>
          <p className="mt-2 text-muted-foreground">
            The people building the future of events.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <Card key={member.name} className="overflow-hidden">
              <CardHeader className="items-center text-center">
                <div
                  className={`flex h-20 w-20 items-center justify-center rounded-full text-xl font-bold ${member.color}`}
                >
                  {member.initial}
                </div>
                <CardTitle className="mt-4 text-lg">{member.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </CardHeader>
              <CardContent>
                <p className="text-center text-sm text-muted-foreground">
                  {member.bio}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Our Values</h2>
          <p className="mt-2 text-muted-foreground">
            The principles that guide everything we do.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <Card key={value.title} className="transition-all hover:shadow-md">
                <CardHeader>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${value.bg}`}
                  >
                    <Icon className={`h-5 w-5 ${value.color}`} />
                  </div>
                  <CardTitle className="text-base">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{value.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
