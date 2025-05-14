import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

/**
 * Change user password
 * @route POST /api/admin/change-password
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
    if (!body.currentPassword || !body.newPassword) {
      return NextResponse.json({
        error: 'Current password and new password are required'
      }, { status: 400 });
    }

    // Get user from database
    const userResults = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!userResults.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = userResults[0];

    // Verify current password
    const isPasswordValid = await bcrypt.compare(body.currentPassword, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(body.newPassword, 10);

    // Update password
    await db.update(users)
      .set({
        password_hash: hashedPassword,
        updated_at: new Date()
      })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json({
      error: 'Failed to change password'
    }, { status: 500 });
  }
}
