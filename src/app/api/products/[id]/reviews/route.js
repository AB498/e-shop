import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import {
  getProductReviews,
  getProductReviewStats,
  createProductReview,
  hasUserPurchasedProduct,
  hasUserReviewedProduct
} from '@/lib/actions/reviews';

/**
 * GET handler to fetch reviews for a specific product
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const productId = parseInt(id);

    // Get reviews and stats
    const reviews = await getProductReviews(productId);
    const stats = await getProductReviewStats(productId);

    // Get user session to check if they can review
    const session = await getServerSession(authOptions);
    let userCanReview = false;
    let hasReviewed = false;

    if (session?.user?.id) {
      const userId = parseInt(session.user.id);
      userCanReview = await hasUserPurchasedProduct(userId, productId);
      hasReviewed = await hasUserReviewedProduct(userId, productId);

      // If user has already reviewed, they can't review again
      if (hasReviewed) {
        userCanReview = false;
      }
    }

    // Ensure stats has the correct data types
    const formattedStats = {
      averageRating: stats.averageRating ? parseFloat(stats.averageRating) : 0.0,
      totalReviews: stats.totalReviews ? parseInt(stats.totalReviews) : 0,
      distribution: stats.distribution || {}
    };

    return NextResponse.json({
      reviews,
      stats: formattedStats,
      userCanReview,
      hasReviewed
    });
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product reviews' },
      { status: 500 }
    );
  }
}

/**
 * POST handler to create a new review for a product
 */
export async function POST(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const productId = parseInt(id);
    const userId = parseInt(session.user.id);

    // Check if user has purchased the product
    const hasPurchased = await hasUserPurchasedProduct(userId, productId);
    if (!hasPurchased) {
      return NextResponse.json(
        { error: 'You can only review products you have purchased' },
        { status: 403 }
      );
    }

    // Check if user has already reviewed this product
    const hasReviewed = await hasUserReviewedProduct(userId, productId);
    if (hasReviewed) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    // Get request body
    const body = await request.json();

    // Validate required fields
    if (!body.rating) {
      return NextResponse.json(
        { error: 'Rating is required' },
        { status: 400 }
      );
    }

    // Create review
    const review = await createProductReview({
      productId,
      userId,
      rating: parseFloat(body.rating),
      reviewText: body.reviewText,
      title: body.title
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error('Error creating product review:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product review' },
      { status: 500 }
    );
  }
}
