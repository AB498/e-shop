import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getOrderDetails } from '@/lib/actions/orders';

// GET handler to fetch a specific order
export async function GET(request, props) {
  const params = await props.params;
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    
    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    // Get order by ID
    // If admin, don't pass userId to get any order
    // If customer, pass userId to only get their own orders
    const userId = session.user.role === 'admin' ? null : session.user.id;
    const order = await getOrderDetails(parseInt(id), userId);
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error(`Error fetching order with ID ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}
