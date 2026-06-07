import { redirect } from 'next/navigation';

// The per-type list page is redundant now that everything lives in the
// central /admin dashboard. Redirect there.
export default function Page() {
  redirect('/admin');
}
