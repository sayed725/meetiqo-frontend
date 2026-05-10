import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import EventDetailClient from './EventDetailClient';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events?limit=20`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    const events = json.data?.events || [];
    return events.map((event: any) => ({ slug: event.slug }));
  } catch {
    return [];
  }
}

async function fetchEvent(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/events/${slug}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await fetchEvent(params.slug);
  if (!event) {
    return { title: 'Event Not Found | Meetiqo' };
  }
  return {
    title: `${event.title} | Meetiqo`,
    description: event.description?.slice(0, 160) || 'Event details on Meetiqo',
    openGraph: event.bannerImage
      ? { images: [{ url: event.bannerImage }] }
      : undefined,
  };
}

export default async function EventDetailPage({ params }: Props) {
  const event = await fetchEvent(params.slug);
  if (!event) notFound();

  return <EventDetailClient event={event} />;
}
