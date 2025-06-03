import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request) {
  try {
    // Get session to check if user is authenticated and is admin
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Run the migration
    const result = await createPaymentTransactionsTable();

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error running migration:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
