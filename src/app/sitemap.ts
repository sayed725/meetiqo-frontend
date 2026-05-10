import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const staticRoutes = [
  '',
  '/events',
  '/about',
  '/blog',
  '/contact',
  '/help',
  '/privacy',
  '/terms',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Fetch top events for dynamic slugs
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/events?limit=40`, {
      next: { revalidate: 3600 },
    });
    const json = await res.json();
    const events = json.data?.events || [];

    const eventPages = events.map((event: any) => ({
      url: `${BASE_URL}/events/${event.slug}`,
      lastModified: new Date(event.updatedAt || event.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [...pages, ...eventPages];
  } catch {
    return pages;
  }
}
