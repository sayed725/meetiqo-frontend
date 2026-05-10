import { Wand2, Lightbulb, CalendarDays, MessageSquareQuote } from 'lucide-react';

const features = [
  {
    icon: Wand2,
    title: 'Event Description Generator',
    description:
      'Let AI craft compelling event descriptions that attract the right audience in seconds.',
  },
  {
    icon: Lightbulb,
    title: 'Smart Recommendations',
    description:
      'Personalized event suggestions based on your interests, location, and past activity.',
  },
  {
    icon: CalendarDays,
    title: 'Event Planner',
    description:
      'AI-assisted scheduling, venue suggestions, and optimal timing for maximum attendance.',
  },
  {
    icon: MessageSquareQuote,
    title: 'Review Summarizer',
    description:
      'Instantly understand community feedback with AI-generated review summaries.',
  },
];

export function AIFeaturesSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            Powered by AI
          </span>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Smarter Events, Effortlessly
          </h2>
          <p className="mt-4 text-muted-foreground">
            Our AI tools help you create, discover, and manage events like never before.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-xl border border-white/10 p-6 transition-all hover:border-primary/30"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
