import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { updateProductStock } from '@/lib/actions/admin';

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
    if (!body.productId || body.stock === undefined) {
      return NextResponse.json({ error: 'Product ID and stock are required' }, { status: 400 });
    }

    // Convert productId to number if it's a string
    const productId = typeof body.productId === 'string' ? parseInt(body.productId, 10) : body.productId;
    const stock = parseInt(body.stock, 10);
    
    if (isNaN(productId) || isNaN(stock) || stock < 0) {
      return NextResponse.json({ error: 'Invalid product ID or stock value' }, { status: 400 });
    }

    // Update product stock
    const updatedProduct = await updateProductStock(productId, stock);
    
    if (!updatedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product stock:', error);
    return NextResponse.json({ error: 'Failed to update product stock' }, { status: 500 });
  }
}
