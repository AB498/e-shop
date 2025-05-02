import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getMonthlySalesData } from '@/lib/actions/admin';

export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get monthly sales data
    const salesData = await getMonthlySalesData();
    return NextResponse.json(salesData);
  } catch (error) {
    console.error('Error fetching monthly sales data:', error);
    return NextResponse.json({ error: 'Failed to fetch monthly sales data' }, { status: 500 });
  }
}
