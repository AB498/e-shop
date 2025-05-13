import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import {
  moveCategoryUp,
  moveCategoryDown,
  updateCategoriesOrder,
  normalizeCategoryOrder
} from '@/lib/actions/categories';

// POST handler to reorder categories
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
    if (!body.action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    let success = false;

    // Handle different reordering actions
    switch (body.action) {
      case 'move_up':
        if (!body.id) {
          return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
        }
        success = await moveCategoryUp(parseInt(body.id));
        break;

      case 'move_down':
        if (!body.id) {
          return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
        }
        success = await moveCategoryDown(parseInt(body.id));
        break;

      case 'update_order':
        if (!body.orderData || !Array.isArray(body.orderData)) {
          return NextResponse.json({ error: 'Order data is required and must be an array' }, { status: 400 });
        }
        success = await updateCategoriesOrder(body.orderData);
        break;

      case 'normalize':
        success = await normalizeCategoryOrder();
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (!success) {
      return NextResponse.json({ error: 'Failed to reorder categories' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering categories:', error);
    return NextResponse.json({ error: 'Failed to reorder categories' }, { status: 500 });
  }
}
