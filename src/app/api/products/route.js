import { NextResponse } from 'next/server';
import { getAllProducts, getProductsByCategories } from '@/lib/actions/products';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Add debug parameter to check what products exist
    const debug = searchParams.get('debug');
    if (debug === 'list') {
      const { getAllProducts } = await import('@/lib/actions/products');
      const result = await getAllProducts({ page: 1, limit: 10 });
      return NextResponse.json({
        debug: true,
        totalProducts: result.pagination.totalProducts,
        products: result.products.map(p => ({ id: p.id, name: p.name }))
      });
    }

    const categoryId = searchParams.get('categoryId');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : 10;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')) : 1;
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')) : null;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')) : null;
    const color = searchParams.get('color') || null;
    const condition = searchParams.get('condition') || null;
    const rating = searchParams.get('rating') || null;
    const promotionId = searchParams.get('promotion') ? parseInt(searchParams.get('promotion')) : null;

    let products;

    if (categoryId) {
      // Convert comma-separated category IDs to an array of numbers
      const categoryIds = categoryId.split(',').map(id => parseInt(id));
      products = await getProductsByCategories(categoryIds, limit);
    } else {
      // Get all products with pagination and filters
      const result = await getAllProducts({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        categoryId: null,
        minPrice,
        maxPrice,
        color,
        condition,
        rating,
        promotionId
      });

      products = result.products;
    }

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
