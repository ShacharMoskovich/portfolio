import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Don't check auth on the login page itself
  const isLoginPage = typeof window === 'undefined' ? false : window.location.pathname.includes('/admin/login');
  
  if (!isLoginPage) {
    const isAdmin = await requireAdmin();
    if (!isAdmin) {
      redirect('/admin/login');
    }
  }

  return <>{children}</>;
}