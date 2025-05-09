import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getUserWishlist, addToWishlist, removeFromWishlist } from '@/lib/actions/wishlist';

// GET /api/wishlist - Get user's wishlist
export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's wishlist
    const wishlist = await getUserWishlist(session.user.id);
    return NextResponse.json({ wishlist });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

// POST /api/wishlist - Add product to wishlist
export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Add product to wishlist
    const result = await addToWishlist(session.user.id, body.productId);
    return NextResponse.json({ success: true, item: result });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 });
  }
}

// DELETE /api/wishlist - Remove product from wishlist
export async function DELETE(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get product ID from query parameters
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    
    // Validate required fields
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Remove product from wishlist
    const success = await removeFromWishlist(session.user.id, parseInt(productId));
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 });
  }
}
