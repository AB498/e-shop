import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authenticateUser, getUserById } from '@/lib/auth';
import { getUserById as getUserByIdFromActions } from '@/lib/actions/users';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await authenticateUser(credentials.email, credentials.password);
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.firstName = user.first_name;
        token.lastName = user.last_name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        // Always fetch fresh user data from the database
        try {
          const freshUserData = await getUserByIdFromActions(token.id);
          if (freshUserData) {
            // Use the fresh data from the database
            session.user.id = freshUserData.id;
            session.user.role = freshUserData.role;
            session.user.firstName = freshUserData.firstName;
            session.user.lastName = freshUserData.lastName;
            session.user.email = freshUserData.email;
            return session;
          }
        } catch (error) {
          console.error('Error fetching fresh user data:', error);
        }

        // Fallback: log them out
        return null;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    signUp: '/auth/register',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
