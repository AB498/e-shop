import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getSalesByCategory } from '@/lib/actions/admin';

export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get sales by category
    const categoryData = await getSalesByCategory();
    return NextResponse.json(categoryData);
  } catch (error) {
    console.error('Error fetching category sales data:', error);
    return NextResponse.json({ error: 'Failed to fetch category sales data' }, { status: 500 });
  }
}
