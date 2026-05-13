'use client';

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
  Sparkles as Logo,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/auth-store';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard, roles: ['USER', 'ORGANIZER', 'ADMIN'] },
  { label: 'My Events', href: '/dashboard/events', icon: CalendarDays, roles: ['ORGANIZER', 'ADMIN'] },
  { label: 'Invitations', href: '/dashboard/invitations', icon: Mail, roles: ['USER', 'ORGANIZER', 'ADMIN'] },
  { label: 'AI Tools', href: '/dashboard/ai', icon: Sparkles, roles: ['USER', 'ORGANIZER', 'ADMIN'] },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart2, roles: ['ORGANIZER', 'ADMIN'] },
  { label: 'Profile', href: '/dashboard/profile', icon: User, roles: ['USER', 'ORGANIZER', 'ADMIN'] },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings, roles: ['USER', 'ORGANIZER', 'ADMIN'] },
  { label: 'Admin Panel', href: '/dashboard/admin', icon: LayoutDashboard, roles: ['ADMIN'] },
  { label: 'Admin Events', href: '/dashboard/admin/events', icon: CalendarDays, roles: ['ADMIN'] },
  { label: 'Admin Users', href: '/dashboard/admin/users', icon: Users, roles: ['ADMIN'] },
  { label: 'AI Usage', href: '/dashboard/admin/ai-usage', icon: Sparkles, roles: ['ADMIN'] },
  { label: 'Reports', href: '/dashboard/admin/reports', icon: Flag, roles: ['ADMIN'] },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { setOpenMobile } = useSidebar();

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(user?.role || 'USER')
  );

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <Sidebar>
      <SidebarHeader className="h-16 border-b flex items-center justify-center px-4">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity w-full">
          <Logo className="h-6 w-6 text-purple-600" />
          <span className="text-xl font-bold">Meetiqo</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isRoot = item.href === '/dashboard' || item.href === '/dashboard/admin';
                const isActive = isRoot 
                  ? pathname === item.href 
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
                
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      onClick={() => setOpenMobile(false)}
                      tooltip={item.label}
                      className={isActive ? "!bg-purple-600 !text-white hover:!bg-purple-700 hover:!text-white" : ""}
                    >
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="w-full flex items-center gap-2">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.avatar || undefined} />
                  <AvatarFallback className="rounded-lg bg-purple-100 text-purple-700">
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{user?.role}</span>
                </div>
                <button
                  title="Logout"
                  className="ml-auto h-8 w-8 shrink-0 flex items-center justify-center rounded-md hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
