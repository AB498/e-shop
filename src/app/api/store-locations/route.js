import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getAllStoreLocations, createStoreLocation } from '@/lib/actions/store-locations';

// GET /api/store-locations - Get all store locations
export async function GET() {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all store locations
    const storeLocations = await getAllStoreLocations();
    return NextResponse.json(storeLocations);
  } catch (error) {
    console.error('Error fetching store locations:', error);
    return NextResponse.json({ error: 'Failed to fetch store locations' }, { status: 500 });
  }
}

// POST /api/store-locations - Create a new store location
export async function POST(request) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const locationData = await request.json();

    // Validate required fields
    if (!locationData.name || !locationData.contact_name || !locationData.contact_number || !locationData.address) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create store location
    const storeLocation = await createStoreLocation(locationData);
    if (!storeLocation) {
      return NextResponse.json({ error: 'Failed to create store location' }, { status: 500 });
    }

    return NextResponse.json(storeLocation, { status: 201 });
  } catch (error) {
    console.error('Error creating store location:', error);
    return NextResponse.json({ error: 'Failed to create store location' }, { status: 500 });
  }
}
