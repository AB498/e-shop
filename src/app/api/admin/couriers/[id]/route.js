import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getCourierById, updateCourier, deleteCourier } from '@/lib/actions/couriers';

// GET handler to fetch a courier by ID
export async function GET(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid courier ID' }, { status: 400 });
    }

    // Get courier by ID
    const courier = await getCourierById(id);
    
    if (!courier) {
      return NextResponse.json({ error: 'Courier not found' }, { status: 404 });
    }

    return NextResponse.json(courier);
  } catch (error) {
    console.error(`Error fetching courier ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch courier' }, { status: 500 });
  }
}

// PUT handler to update a courier
export async function PUT(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid courier ID' }, { status: 400 });
    }

    // Get request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ error: 'Courier name is required' }, { status: 400 });
    }

    // Update courier
    const courier = await updateCourier(id, body);
    
    if (!courier) {
      return NextResponse.json({ error: 'Failed to update courier' }, { status: 500 });
    }

    return NextResponse.json(courier);
  } catch (error) {
    console.error(`Error updating courier ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to update courier' }, { status: 500 });
  }
}

// DELETE handler to delete a courier
export async function DELETE(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid courier ID' }, { status: 400 });
    }

    // Delete courier
    const success = await deleteCourier(id);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete courier' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting courier ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to delete courier' }, { status: 500 });
  }
}
