import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getPaymentStats } from '@/lib/actions/payments';

export async function GET(request) {
  try {
    // Get session to check if user is authenticated and is admin
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get payment statistics
    const stats = await getPaymentStats();

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching payment statistics:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
