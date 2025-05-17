import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';
import { productReviews, users, products } from '@/db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';

/**
 * GET handler to fetch all reviews for admin
 */
export async function GET(request) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all reviews with user and product information
    const reviews = await db
      .select({
        id: productReviews.id,
        productId: productReviews.product_id,
        userId: productReviews.user_id,
        rating: productReviews.rating,
        reviewText: productReviews.review_text,
        title: productReviews.title,
        verifiedPurchase: productReviews.verified_purchase,
        status: productReviews.status,
        createdAt: productReviews.created_at,
        updatedAt: productReviews.updated_at,
        userName: sql`concat(${users.first_name}, ' ', ${users.last_name})`,
        userEmail: users.email,
        productName: products.name,
      })
      .from(productReviews)
      .innerJoin(users, eq(productReviews.user_id, users.id))
      .innerJoin(products, eq(productReviews.product_id, products.id))
      .orderBy(desc(productReviews.created_at));

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews for admin:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
