'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  type TooltipProps,
} from 'recharts';
import {
  CalendarRange,
  Star,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { queryKeys } from '@/lib/query-keys';
import api from '@/lib/api';

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background p-3 shadow-sm">
      <p className="text-sm font-medium text-foreground">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-sm text-muted-foreground">
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

interface ParticipantsOverTime {
  date: string;
  participants: number;
}

interface EventsByCategory {
  category: string;
  count: number;
}

interface AnalyticsMetrics {
  avgRating: number;
  totalReviews: number;
  engagementRate: number;
}

export default function AnalyticsPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data: participantsData } = useQuery<ParticipantsOverTime[]>({
    queryKey: queryKeys.analytics.participants({ start: startDate, end: endDate }),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      const res = await api.get(`/analytics/participants?${params.toString()}`);
      return res.data.data?.chartData || [];
    },
  });

  const { data: categoryData } = useQuery<EventsByCategory[]>({
    queryKey: queryKeys.analytics.categories,
    queryFn: async () => {
      const res = await api.get('/analytics/events-by-category');
      return res.data.data?.categories || [];
    },
  });

  const { data: metrics } = useQuery<AnalyticsMetrics>({
    queryKey: queryKeys.analytics.metrics,
    queryFn: async () => {
      const res = await api.get('/analytics/metrics');
      return res.data.data || {};
    },
  });

  const metricCards = [
    {
      label: 'Average Rating',
      value: metrics?.avgRating?.toFixed(1) || '0.0',
      icon: Star,
      color: 'text-yellow-600',
    },
    {
      label: 'Total Reviews',
      value: metrics?.totalReviews?.toLocaleString() || '0',
      icon: MessageSquare,
      color: 'text-blue-600',
    },
    {
      label: 'Engagement Rate',
      value: `${metrics?.engagementRate?.toFixed(1) || '0.0'}%`,
      icon: TrendingUp,
      color: 'text-green-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Track your event performance and audience engagement.
        </p>
      </div>

      {/* Date Range */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarRange className="h-4 w-4" />
            Date Range
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-1">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {metricCards.map((m) => {
          const Icon = m.icon;
          return (
            <Card key={m.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{m.label}</CardTitle>
                <Icon className={`h-4 w-4 ${m.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{m.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Participants Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Participants Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {participantsData && participantsData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={participantsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="participants"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      name="Participants"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No data available for the selected range.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Events by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Events by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {categoryData && categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend />
                    <Bar dataKey="count" fill="hsl(var(--primary))" name="Events" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No data available.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
