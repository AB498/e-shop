import { NextResponse } from 'next/server';
import { getNewProducts } from '@/lib/actions/products';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : 3;

    // Get new products
    const products = await getNewProducts(limit);

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching new products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch new products' },
      { status: 500 }
    );
  }
}
