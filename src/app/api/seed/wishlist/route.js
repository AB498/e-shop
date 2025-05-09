import { NextResponse } from 'next/server';
import { seedWishlistItems } from '@/lib/seed/wishlist-seed';

export async function POST() {
  try {
    const result = await seedWishlistItems();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message
      });
    } else {
      return NextResponse.json({
        success: false,
        message: result.message
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error seeding wishlist items:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to seed wishlist items'
    }, { status: 500 });
  }
}
