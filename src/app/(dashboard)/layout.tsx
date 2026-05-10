import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';
import NotificationsProvider from '@/components/dashboard/NotificationsProvider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check auth via middleware (already handled by middleware.ts)
  // This is a fallback in case middleware is bypassed
  const token = cookies().get('token')?.value;
  if (!token) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <TopBar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
      <NotificationsProvider />
    </div>
  );
}
