import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getPaymentTransactionById } from '@/lib/actions/payments';

export async function GET(request, props) {
  const params = await props.params;
  try {
    // Get session to check if user is authenticated and is admin
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    // Get payment transaction details
    const transaction = await getPaymentTransactionById(parseInt(id));

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Error fetching payment transaction details:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
