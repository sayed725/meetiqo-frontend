import EventsClient from './EventsClient';

interface EventsPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function EventsPage({ searchParams }: EventsPageProps) {
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === 'string') {
      normalized[key] = value;
    } else if (Array.isArray(value) && value.length > 0) {
      normalized[key] = value[0];
    }
  }

  return <EventsClient initialParams={normalized} />;
}
