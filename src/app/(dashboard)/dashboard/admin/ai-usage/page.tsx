'use client';

import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BrainCircuit, Clock } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import api from '@/lib/api';

interface AIHistoryItem {
  id: string;
  user: { name: string; email: string };
  featureType: string;
  tokensUsed: number;
  createdAt: string;
}

interface AIFeatureUsage {
  featureType: string;
  totalTokens: number;
}

export default function AIUsagePage() {
  const { data: history } = useQuery<AIHistoryItem[]>({
    queryKey: ['admin-ai-history'],
    queryFn: async () => {
      const res = await api.get('/admin/ai-history');
      return res.data.data?.history || [];
    },
  });

  const { data: featureUsage } = useQuery<AIFeatureUsage[]>({
    queryKey: ['admin-ai-features'],
    queryFn: async () => {
      const res = await api.get('/admin/ai-usage-by-feature');
      return res.data.data?.features || [];
    },
  });

  const totalTokens = history?.reduce((sum, h) => sum + h.tokensUsed, 0) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Usage Monitoring</h1>
        <p className="text-sm text-muted-foreground">
          Track AI feature usage and token consumption across the platform.
        </p>
      </div>

      {/* Total Tokens Card */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tokens Used</CardTitle>
            <BrainCircuit className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTokens.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total AI Requests</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{history?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">AI Usage by Feature Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {featureUsage && featureUsage.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={featureUsage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="featureType" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="totalTokens" fill="#7c3aed" name="Tokens Used" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No AI usage data available.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">AI History Log</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Feature</TableHead>
                <TableHead>Tokens Used</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(!history || history.length === 0) && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No AI history records.
                  </TableCell>
                </TableRow>
              )}
              {history?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.user.name}</TableCell>
                  <TableCell>{item.featureType}</TableCell>
                  <TableCell>{item.tokensUsed.toLocaleString()}</TableCell>
                  <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
