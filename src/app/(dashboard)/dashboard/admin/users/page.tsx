'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Search,
  Ban,
  CheckCircle,
  Eye,
  UserCheck,
  Shield,
  Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

interface UserItem {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: 'USER' | 'ORGANIZER' | 'ADMIN';
  isBanned: boolean;
  isVerified: boolean;
  createdAt: string;
}

export default function UserManagementPage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'joined'>('joined');
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [dialogAction, setDialogAction] = useState<'ban' | 'unban' | 'role' | null>(null);
  const [newRole, setNewRole] = useState<string>('');
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery<UserItem[]>({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await api.get('/admin/users');
      return res.data.data?.users || [];
    },
  });

  const banMutation = useMutation({
    mutationFn: async (userId: string) => {
      const res = await api.put(`/admin/users/${userId}/ban`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setDialogAction(null);
      setSelectedUser(null);
    },
  });

  const unbanMutation = useMutation({
    mutationFn: async (userId: string) => {
      const res = await api.put(`/admin/users/${userId}/unban`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setDialogAction(null);
      setSelectedUser(null);
    },
  });

  const roleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const res = await api.put(`/admin/users/${userId}/role`, { role });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setDialogAction(null);
      setSelectedUser(null);
      setNewRole('');
    },
  });

  const filtered = users
    ?.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const openDialog = (user: UserItem, action: 'ban' | 'unban' | 'role') => {
    setSelectedUser(user);
    setDialogAction(action);
    if (action === 'role') setNewRole(user.role);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-sm text-muted-foreground">
          Manage platform users, roles, and status.
        </p>
      </div>

      {/* Search & Sort */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={sortBy}
          onValueChange={(v) => setSortBy(v as 'name' | 'joined')}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="joined">Sort by Joined</SelectItem>
            <SelectItem value="name">Sort by Name</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {!isLoading && filtered?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            )}
            {filtered?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar || undefined} />
                      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{user.role}</Badge>
                </TableCell>
                <TableCell>
                  {user.isBanned ? (
                    <Badge className="bg-red-100 text-red-700">Banned</Badge>
                  ) : user.isVerified ? (
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
                  )}
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" title="View Profile" asChild>
                      <Link href={`/dashboard/users/${user.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Change Role"
                      onClick={() => openDialog(user, 'role')}
                    >
                      <Shield className="h-4 w-4" />
                    </Button>
                    {user.isBanned ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Unban"
                        onClick={() => openDialog(user, 'unban')}
                      >
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Ban"
                        onClick={() => openDialog(user, 'ban')}
                      >
                        <Ban className="h-4 w-4 text-red-600" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Confirm Dialog */}
      <Dialog
        open={!!dialogAction}
        onOpenChange={(open) => {
          if (!open) {
            setDialogAction(null);
            setSelectedUser(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === 'ban' && 'Ban User'}
              {dialogAction === 'unban' && 'Unban User'}
              {dialogAction === 'role' && 'Change Role'}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === 'ban' && (
                <>Are you sure you want to ban <strong>{selectedUser?.name}</strong>?</>
              )}
              {dialogAction === 'unban' && (
                <>Are you sure you want to unban <strong>{selectedUser?.name}</strong>?</>
              )}
              {dialogAction === 'role' && (
                <>Change role for <strong>{selectedUser?.name}</strong>.</>
              )}
            </DialogDescription>
          </DialogHeader>

          {dialogAction === 'role' && (
            <div className="py-2">
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">USER</SelectItem>
                  <SelectItem value="ORGANIZER">ORGANIZER</SelectItem>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogAction(null);
                setSelectedUser(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant={
                dialogAction === 'ban' ? 'destructive' : 'default'
              }
              onClick={() => {
                if (!selectedUser) return;
                if (dialogAction === 'ban') banMutation.mutate(selectedUser.id);
                if (dialogAction === 'unban') unbanMutation.mutate(selectedUser.id);
                if (dialogAction === 'role') {
                  roleMutation.mutate({
                    userId: selectedUser.id,
                    role: newRole,
                  });
                }
              }}
              disabled={
                (dialogAction === 'role' && !newRole) ||
                (dialogAction === 'ban' && banMutation.isPending) ||
                (dialogAction === 'unban' && unbanMutation.isPending) ||
                (dialogAction === 'role' && roleMutation.isPending)
              }
            >
              {dialogAction === 'ban' && 'Ban'}
              {dialogAction === 'unban' && 'Unban'}
              {dialogAction === 'role' && 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
