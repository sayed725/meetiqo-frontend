'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Download, Filter, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import api from '@/lib/api';

interface Report {
  id: string;
  type: 'EVENT' | 'USER' | 'CONTENT';
  title: string;
  description: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  reportedBy: { name: string; email: string };
  targetId: string;
  createdAt: string;
  resolvedAt?: string;
}

const statusColorMap: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  RESOLVED: 'bg-green-100 text-green-700',
  DISMISSED: 'bg-gray-100 text-gray-700',
};

const typeColorMap: Record<string, string> = {
  EVENT: 'bg-blue-100 text-blue-700',
  USER: 'bg-purple-100 text-purple-700',
  CONTENT: 'bg-orange-100 text-orange-700',
};

export default function ReportsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const { data: reports, isLoading } = useQuery<Report[]>({
    queryKey: ['admin-reports', statusFilter, typeFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (typeFilter !== 'ALL') params.append('type', typeFilter);
      const res = await api.get(`/admin/reports?${params.toString()}`);
      return res.data.data?.reports || [];
    },
  });

  const filtered = reports?.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.reportedBy.name.toLowerCase().includes(search.toLowerCase())
  );

  const statusCounts = {
    PENDING: reports?.filter((r) => r.status === 'PENDING').length || 0,
    RESOLVED: reports?.filter((r) => r.status === 'RESOLVED').length || 0,
    DISMISSED: reports?.filter((r) => r.status === 'DISMISSED').length || 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports & Moderation</h1>
        <p className="text-sm text-muted-foreground">
          Review and manage user-reported content and violations.
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.PENDING}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.RESOLVED}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Dismissed</CardTitle>
            <AlertTriangle className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.DISMISSED}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
            <SelectItem value="DISMISSED">Dismissed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="EVENT">Event</SelectItem>
            <SelectItem value="USER">User</SelectItem>
            <SelectItem value="CONTENT">Content</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Reports Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Reported By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && filtered?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No reports found.
                  </TableCell>
                </TableRow>
              )}
              {filtered?.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={typeColorMap[report.type] || 'bg-gray-100 text-gray-700'}
                    >
                      {report.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium max-w-[150px] truncate">
                    {report.title}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{report.description}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{report.reportedBy.name}</div>
                      <div className="text-muted-foreground text-xs">{report.reportedBy.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={statusColorMap[report.status] || 'bg-gray-100 text-gray-700'}
                    >
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                      {report.status === 'PENDING' && (
                        <>
                          <Button variant="ghost" size="sm" className="text-green-600">
                            Resolve
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-600">
                            Dismiss
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
