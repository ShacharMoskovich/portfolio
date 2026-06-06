import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ArtworksClient from './ArtworksClient';

export const dynamic = 'force-dynamic';

export default async function ArtworksPage() {
  if (!(await requireAdmin())) {
    redirect('/admin/login');
  }

  return <ArtworksClient />;
}