import Link from 'next/link';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const posts = [
  {
    slug: 'building-community-events',
    title: 'The Art of Building Community Events That Last',
    excerpt:
      'Discover the strategies top organizers use to create recurring meetups with loyal attendees. From choosing the right venue to fostering genuine connections.',
    category: 'Community',
    readTime: '6 min read',
    date: 'Mar 15, 2025',
    gradient: 'from-purple-500/20 to-pink-500/20',
  },
  {
    slug: 'ai-event-planning',
    title: 'How AI is Transforming Event Planning in 2025',
    excerpt:
      'From automated scheduling to intelligent attendee matching, explore how AI tools are saving organizers hours of manual work every week.',
    category: 'AI',
    readTime: '8 min read',
    date: 'Feb 28, 2025',
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    slug: 'networking-tips',
    title: 'Networking Tips for Introverts at Tech Meetups',
    excerpt:
      'Practical advice for making meaningful connections without the overwhelm. Strategies that work for shy professionals and seasoned networkers alike.',
    category: 'Career',
    readTime: '5 min read',
    date: 'Jan 20, 2025',
    gradient: 'from-emerald-500/20 to-teal-500/20',
  },
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">Blog</h1>
        <p className="mt-3 text-muted-foreground">
          Insights on events, community building, and the future of meetups.
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card
            key={post.slug}
            className="group flex flex-col overflow-hidden transition-all hover:shadow-lg"
          >
            {/* Placeholder banner */}
            <div
              className={`h-48 bg-gradient-to-br ${post.gradient} flex items-center justify-center`}
            >
              <span className="text-sm font-medium text-muted-foreground/60">
                {post.category}
              </span>
            </div>

            <CardHeader className="flex-1">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{post.category}</Badge>
              </div>
              <CardTitle className="mt-2 text-lg leading-snug group-hover:text-primary">
                {post.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
