import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getAreas } from '@/lib/services/pathao-courier';

// GET handler to fetch Pathao areas
export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get zone ID from query parameters
    const { searchParams } = new URL(request.url);
    const zoneId = searchParams.get('zoneId');

    if (!zoneId) {
      return NextResponse.json({ error: 'Zone ID is required' }, { status: 400 });
    }

    // Get areas from Pathao API
    const areas = await getAreas(zoneId);
    return NextResponse.json(areas);
  } catch (error) {
    console.error('Error fetching Pathao areas:', error);
    return NextResponse.json({ error: 'Failed to fetch Pathao areas' }, { status: 500 });
  }
}
