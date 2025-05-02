import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getZones } from '@/lib/services/pathao-courier';

// GET handler to fetch Pathao zones
export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get city ID from query parameters
    const { searchParams } = new URL(request.url);
    const cityId = searchParams.get('cityId');

    if (!cityId) {
      return NextResponse.json({ error: 'City ID is required' }, { status: 400 });
    }

    // Get zones from Pathao API
    const zones = await getZones(cityId);
    return NextResponse.json(zones);
  } catch (error) {
    console.error('Error fetching Pathao zones:', error);
    return NextResponse.json({ error: 'Failed to fetch Pathao zones' }, { status: 500 });
  }
}
