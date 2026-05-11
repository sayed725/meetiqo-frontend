import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';
import NotificationsProvider from '@/components/dashboard/NotificationsProvider';

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get('token')?.value;
  if (!token) {
    redirect('/login');
  }

  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <TopBar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
      <NotificationsProvider />
    </SidebarProvider>
  );
}
