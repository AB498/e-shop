import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getAllPaymentTransactions } from '@/lib/actions/payments';

export async function GET(request) {
  try {
    // Get session to check if user is authenticated and is admin
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')) : 1;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : 10;
    const status = searchParams.get('status') || null;
    const search = searchParams.get('search') || null;

    // Get payment transactions
    const result = await getAllPaymentTransactions({
      page,
      limit,
      status,
      search,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching payment transactions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
