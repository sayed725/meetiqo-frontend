import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Designer at Stripe',
    avatar: 'SC',
    quote:
      'Meetiqo completely changed how I network. The AI recommendations surfaced design events I would have never found on my own. I have made genuine connections that turned into collaborations.',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Startup Founder',
    avatar: 'MJ',
    quote:
      'As an organizer, the AI event description generator saves me hours every week. Attendance at my tech meetups has doubled since I started using Meetiqo. The platform just works.',
    rating: 5,
  },
  {
    name: 'Aisha Patel',
    role: 'Software Engineer at Google',
    avatar: 'AP',
    quote:
      'The smart recommendations are scarily accurate. Every event I attend through Meetiqo feels like it was handpicked for me. It has become my go-to for finding meaningful tech community events.',
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-2xl font-bold tracking-tight sm:text-3xl">
          What Our Community Says
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="border-border/50">
              <CardContent className="p-6">
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
