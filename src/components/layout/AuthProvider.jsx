import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Topbar from './Topbar';

export default async function AuthProvider() {
  // Fetch the session on the server
  const session = await getServerSession(authOptions);
  
  // Determine authentication state
  const isAuthenticated = !!session;
  const isAdmin = isAuthenticated && session?.user?.role === 'admin';
  
  // Pass auth state as props to Topbar
  return (
    <Topbar 
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
