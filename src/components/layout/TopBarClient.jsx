import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getAllCategories } from '@/lib/actions/categories';
import Topbar from './Topbar';

export default async function TopBarClient() {
  // Fetch the session and categories on the server
  const [session, categories] = await Promise.all([
    getServerSession(authOptions),
    getAllCategories()
  ]);

  // Determine authentication state
  const isAuthenticated = !!session;
  const isAdmin = isAuthenticated && session?.user?.role === 'admin';

  // Pass auth state and categories as props to Topbar
  return (
    <Topbar
      categories={categories}
      serverSession={session}
      serverAuthStatus={{
        isAuthenticated,
        isAdmin,
        firstName: session?.user?.firstName || null,
        lastName: session?.user?.lastName || null,
        role: session?.user?.role || null
      }}
    />
  );
}
