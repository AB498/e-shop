import { NextResponse } from 'next/server';
import { getRelatedProducts } from '@/lib/actions/products';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const categoryId = searchParams.get('categoryId');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : 4;

    if (!productId || !categoryId) {
      return NextResponse.json(
        { error: 'Product ID and Category ID are required' },
        { status: 400 }
      );
    }

    // Get related products
    const products = await getRelatedProducts(
      parseInt(productId),
      parseInt(categoryId),
      limit
    );

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching related products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch related products' },
      { status: 500 }
    );
  }
}
