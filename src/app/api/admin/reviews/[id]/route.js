import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';
import { productReviews } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * PATCH handler to update a review's status
 */
export async function PATCH(request, { params }) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    
    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ error: 'Invalid review ID' }, { status: 400 });
    }

    const reviewId = parseInt(id);
    
    // Get request body
    const body = await request.json();
    
    // Validate status
    if (!body.status || !['published', 'pending', 'rejected'].includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: published, pending, rejected' },
        { status: 400 }
      );
    }
    
    // Update review status
    const result = await db
      .update(productReviews)
      .set({
        status: body.status,
        updated_at: new Date(),
      })
      .where(eq(productReviews.id, reviewId))
      .returning();
    
    if (!result.length) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, review: result[0] });
  } catch (error) {
    console.error('Error updating review status:', error);
    return NextResponse.json(
      { error: 'Failed to update review status' },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler to delete a review
 */
export async function DELETE(request, { params }) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    
    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ error: 'Invalid review ID' }, { status: 400 });
    }

    const reviewId = parseInt(id);
    
    // Delete review
    const result = await db
      .delete(productReviews)
      .where(eq(productReviews.id, reviewId))
      .returning();
    
    if (!result.length) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}
