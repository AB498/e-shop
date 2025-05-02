import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getStores } from '@/lib/services/pathao-courier';

// GET handler to fetch Pathao stores
export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get stores from Pathao API
    const stores = await getStores();
    return NextResponse.json(stores);
  } catch (error) {
    console.error('Error fetching Pathao stores:', error);
    return NextResponse.json({ error: 'Failed to fetch Pathao stores' }, { status: 500 });
  }
}
