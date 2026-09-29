import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/adminAuth';

/**
 * VANIKARA has no public user accounts, so there is no user dashboard.
 * Admins are sent to the admin console; everyone else to sign-in.
 */
export default async function DashboardPage() {
  const session = await getAdminSession();
  redirect(session ? '/admin' : '/login');
}
