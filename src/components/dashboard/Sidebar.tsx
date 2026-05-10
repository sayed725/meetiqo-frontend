'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  Mail,
  Sparkles,
  BarChart2,
  User,
  Settings,
  Users,
  Flag,
  LogOut,
  Menu,
  Sparkles as Logo,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/auth-store';

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard, roles: ['USER', 'ORGANIZER', 'ADMIN'] },
  { label: 'My Events', href: '/dashboard/events', icon: CalendarDays, roles: ['ORGANIZER', 'ADMIN'] },
  { label: 'Invitations', href: '/dashboard/invitations', icon: Mail, roles: ['USER', 'ORGANIZER', 'ADMIN'] },
  { label: 'AI Tools', href: '/dashboard/ai-tools', icon: Sparkles, roles: ['USER', 'ORGANIZER', 'ADMIN'] },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart2, roles: ['ORGANIZER', 'ADMIN'] },
  { label: 'Profile', href: '/dashboard/profile', icon: User, roles: ['USER', 'ORGANIZER', 'ADMIN'] },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings, roles: ['USER', 'ORGANIZER', 'ADMIN'] },
  { label: 'Admin Panel', href: '/dashboard/admin', icon: LayoutDashboard, roles: ['ADMIN'] },
  { label: 'Admin Events', href: '/dashboard/admin/events', icon: CalendarDays, roles: ['ADMIN'] },
  { label: 'Admin Users', href: '/dashboard/admin/users', icon: Users, roles: ['ADMIN'] },
  { label: 'AI Usage', href: '/dashboard/admin/ai-usage', icon: Sparkles, roles: ['ADMIN'] },
  { label: 'Reports', href: '/dashboard/admin/reports', icon: Flag, roles: ['ADMIN'] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(user?.role || 'USER')
  );

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed left-4 top-4 z-50 p-2 rounded-lg bg-background border"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background transition-transform duration-300 lg:relative lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <Link href="/" className="flex h-16 items-center gap-2 border-b px-6 hover:opacity-80 transition-opacity">
            <Logo className="h-6 w-6 text-purple-600" />
            <span className="text-xl font-bold">Meetiqo</span>
          </Link>

          {/* Nav items */}
          <nav className="flex-1 space-y-1 p-4">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-purple-600 text-white'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.avatar || undefined} />
                <AvatarFallback>
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{user?.name}</p>
                <Badge variant="secondary" className="text-[10px]">
                  {user?.role}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
