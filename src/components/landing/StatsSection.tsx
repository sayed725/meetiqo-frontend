'use client';

import { useCountUp } from '@/hooks/use-count-up';

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useCountUp(value, 2000);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-extrabold tracking-tight sm:text-5xl">
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="mt-2 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="bg-zinc-900 py-20 text-white dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
          <StatItem value={10000} suffix="+" label="Events Hosted" />
          <StatItem value={50000} suffix="+" label="Community Members" />
          <StatItem value={200} suffix="+" label="Cities Worldwide" />
          <StatItem value={98} suffix="%" label="Satisfaction Rate" />
        </div>
      </div>
    </section>
  );
}
