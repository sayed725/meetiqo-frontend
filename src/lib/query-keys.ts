export const queryKeys = {
  events: {
    all: ['events'] as const,
    list: (params: Record<string, string>) => ['events', 'list', params] as const,
    detail: (slug: string) => ['events', 'detail', slug] as const,
    participants: (id: string) => ['events', 'participants', id] as const,
    reviews: (id: string) => ['events', 'reviews', id] as const,
    myEvents: ['events', 'my'] as const,
  },
  notifications: {
    all: ['notifications'] as const,
    list: (limit?: number) => ['notifications', 'list', limit ?? 20] as const,
  },
  analytics: {
    participants: (range?: { start?: string; end?: string }) =>
      ['analytics', 'participants', range?.start ?? '', range?.end ?? ''] as const,
    categories: ['analytics', 'categories'] as const,
    metrics: ['analytics', 'metrics'] as const,
  },
  dashboard: {
    stats: ['dashboard', 'stats'] as const,
    recentEvents: ['dashboard', 'recent-events'] as const,
  },
  ai: {
    recommendations: ['ai', 'recommendations'] as const,
    history: (featureType: string) => ['ai', 'history', featureType] as const,
    insights: (eventId: string) => ['ai', 'insights', eventId] as const,
  },
  invitations: {
    received: ['invitations', 'received'] as const,
  },
  users: {
    all: ['users'] as const,
    me: ['users', 'me'] as const,
  },
} as const;
