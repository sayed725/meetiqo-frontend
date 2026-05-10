import Link from 'next/link';
import {
  Cpu,
  Music,
  Briefcase,
  HeartPulse,
  Dumbbell,
  Palette,
  GraduationCap,
  Users,
  MoreHorizontal,
} from 'lucide-react';

const categories = [
  { label: 'Tech', value: 'TECH', icon: Cpu },
  { label: 'Music', value: 'MUSIC', icon: Music },
  { label: 'Business', value: 'BUSINESS', icon: Briefcase },
  { label: 'Health', value: 'HEALTH', icon: HeartPulse },
  { label: 'Sports', value: 'SPORTS', icon: Dumbbell },
  { label: 'Art', value: 'ART', icon: Palette },
  { label: 'Education', value: 'EDUCATION', icon: GraduationCap },
  { label: 'Social', value: 'SOCIAL', icon: Users },
  { label: 'Other', value: 'OTHER', icon: MoreHorizontal },
];

export function CategoriesSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center text-2xl font-bold tracking-tight sm:text-3xl">
          Explore by Category
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.value}
                href={`/events?category=${cat.value}`}
                className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{cat.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
