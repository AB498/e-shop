import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getStoreLocationById, updateStoreLocation, deleteStoreLocation } from '@/lib/actions/store-locations';

// GET /api/store-locations/:id - Get a store location by ID
export async function GET(request, { params }) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await params;
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: 'Store location ID is required' }, { status: 400 });
    }

    // Get store location by ID
    const storeLocation = await getStoreLocationById(parseInt(id));
    if (!storeLocation) {
      return NextResponse.json({ error: 'Store location not found' }, { status: 404 });
    }

    return NextResponse.json(storeLocation);
  } catch (error) {
    console.error(`Error fetching store location with ID ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch store location' }, { status: 500 });
  }
}

// PUT /api/store-locations/:id - Update a store location
export async function PUT(request, { params }) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await params;
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: 'Store location ID is required' }, { status: 400 });
    }

    // Parse request body
    const locationData = await request.json();

    // Validate required fields
    if (!locationData.name || !locationData.contact_name || !locationData.contact_number || !locationData.address) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Update store location
    const storeLocation = await updateStoreLocation(parseInt(id), locationData);
    if (!storeLocation) {
      return NextResponse.json({ error: 'Failed to update store location' }, { status: 500 });
    }

    return NextResponse.json(storeLocation);
  } catch (error) {
    console.error(`Error updating store location with ID ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to update store location' }, { status: 500 });
  }
}

// DELETE /api/store-locations/:id - Delete a store location
export async function DELETE(request, { params }) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await params;
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: 'Store location ID is required' }, { status: 400 });
    }

    // Delete store location
    const success = await deleteStoreLocation(parseInt(id));
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete store location' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Store location deleted successfully' });
  } catch (error) {
    console.error(`Error deleting store location with ID ${params.id}:`, error);
    return NextResponse.json({ error: error.message || 'Failed to delete store location' }, { status: 500 });
  }
}
