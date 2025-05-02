import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getCities } from '@/lib/services/pathao-courier';

// GET handler to fetch Pathao cities
export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get cities from Pathao API
    const cities = await getCities();
    return NextResponse.json(cities);
  } catch (error) {
    console.error('Error fetching Pathao cities:', error);
    return NextResponse.json({ error: 'Failed to fetch Pathao cities' }, { status: 500 });
  }
}
