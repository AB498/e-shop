import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { addProductImages, getProductImages, deleteAllProductImages } from '@/lib/actions/product-images';

export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get product ID from query params
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Get product images
    const images = await getProductImages(Number(productId));
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching product images:', error);
    return NextResponse.json({ error: 'Failed to fetch product images' }, { status: 500 });
  }
}

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
    if (!body.productId || !body.images || !Array.isArray(body.images)) {
      return NextResponse.json({ error: 'Product ID and images array are required' }, { status: 400 });
    }

    // Add product images
    const images = await addProductImages(Number(body.productId), body.images);

    return NextResponse.json({ success: true, images });
  } catch (error) {
    console.error('Error adding product images:', error);
    return NextResponse.json({
      error: error.message || 'Failed to add product images'
    }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get product ID from query params
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Delete all product images
    const deletedCount = await deleteAllProductImages(Number(productId));

    return NextResponse.json({
      success: true,
      message: `Deleted ${deletedCount} images for product ${productId}`
    });
  } catch (error) {
    console.error('Error deleting product images:', error);
    return NextResponse.json({
      error: error.message || 'Failed to delete product images'
    }, { status: 500 });
  }
}
