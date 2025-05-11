'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getUserById } from '@/lib/actions/users';

/**
 * Update the session data with the latest user information
 * This is needed because NextAuth doesn't automatically update the session
 * when user data changes in the database
 * 
 * @returns {Promise<Object|null>} Updated session or null if not authenticated
 */
export async function refreshSession() {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return null;
    }
    
    // Get the latest user data from the database
    const userId = session.user.id;
    const latestUserData = await getUserById(userId);
    
    if (!latestUserData) {
      return session; // Return original session if user not found
    }
    
    // Update the session with the latest user data
    const updatedSession = {
      ...session,
      user: {
        ...session.user,
        firstName: latestUserData.firstName,
        lastName: latestUserData.lastName,
        email: latestUserData.email,
        phone: latestUserData.phone,
        address: latestUserData.address,
        city: latestUserData.city,
        postCode: latestUserData.postCode,
        country: latestUserData.country,
        region: latestUserData.region,
      }
    };
    
    return updatedSession;
  } catch (error) {
    console.error('Error refreshing session:', error);
    return null;
  }
}
