'use client';

import Link from 'next/link';
import {
  FileText,
  Sparkles,
  CalendarClock,
  MessageSquareQuote,
  ArrowRight,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const tools = [
  {
    id: 'description',
    title: 'Event Description Generator',
    description:
      'Generate compelling event descriptions, titles, tags, and banner prompts powered by AI.',
    icon: FileText,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    badge: 'Organizer',
  },
  {
    id: 'recommendations',
    title: 'Smart Recommendations',
    description:
      'Get personalized event recommendations based on your interests and past activity.',
    icon: Sparkles,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    badge: 'All Users',
  },
  {
    id: 'planner',
    title: 'Event Planner Assistant',
    description:
      'Build a complete event plan with timeline, checklists, and budget breakdown.',
    icon: CalendarClock,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    badge: 'Organizer',
  },
  {
    id: 'summarizer',
    title: 'Review Summarizer',
    description:
      'Summarize event reviews into actionable insights, sentiment analysis, and suggestions.',
    icon: MessageSquareQuote,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    badge: 'Organizer',
  },
];

export default function AIToolsHubPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Tools</h1>
        <p className="text-sm text-muted-foreground">
          Supercharge your event experience with AI-powered tools.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Card
              key={tool.id}
              className="group transition-all hover:shadow-md"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${tool.bg}`}
                  >
                    <Icon className={`h-5 w-5 ${tool.color}`} />
                  </div>
                  <Badge variant="secondary">{tool.badge}</Badge>
                </div>
                <CardTitle className="text-lg">{tool.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {tool.description}
                </p>
                <Button asChild className="w-full">
                  <Link href={`/dashboard/ai/${tool.id}`}>
                    Launch Tool
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
