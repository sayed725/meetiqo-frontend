import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import EventDetailClient from './EventDetailClient';

// Force dynamic rendering — the backend API is external and not available at build time
export const dynamic = 'force-dynamic';

interface Props {
  params: { slug: string };
}

async function fetchEvent(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/events/${slug}`,
      { cache: 'no-store' }
    );
    if (res.status === 404) return null;
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
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

