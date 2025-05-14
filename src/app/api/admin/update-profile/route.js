import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { updateUserProfile, isEmailInUse } from '@/lib/actions/users';

/**
 * Update admin user profile
 * @route POST /api/admin/update-profile
 */
export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const body = await request.json();

    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email) {
      return NextResponse.json({
        error: 'First name, last name, and email are required'
      }, { status: 400 });
    }

    // Check if email is being changed and if it's already in use
    if (body.email !== session.user.email) {
      const emailInUse = await isEmailInUse(body.email);
      if (emailInUse) {
        return NextResponse.json({
          error: 'Email is already in use'
        }, { status: 400 });
      }
    }

    // Update user profile
    const updatedUser = await updateUserProfile(session.user.id, body);

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({
      error: 'Failed to update profile'
    }, { status: 500 });
  }
}
