import { NextResponse } from 'next/server';
import { getAllCategories } from '@/lib/actions/categories';

export async function GET(request) {
  try {
    // Get all categories
    const categories = await getAllCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
