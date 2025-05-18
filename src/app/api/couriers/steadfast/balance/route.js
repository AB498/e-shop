import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getBalance } from '@/lib/services/steadfast-courier';

/**
 * GET handler to fetch Steadfast balance
 */
export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get balance from Steadfast API
    const balance = await getBalance();
    return NextResponse.json(balance);
  } catch (error) {
    console.error('Error fetching Steadfast balance:', error);
    return NextResponse.json({ error: 'Failed to fetch Steadfast balance' }, { status: 500 });
  }
}
