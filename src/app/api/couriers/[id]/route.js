import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getCourierById, updateCourier, deleteCourier } from '@/lib/actions/couriers';

// GET handler to fetch a specific courier
export async function GET(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await params;
    const { id } = params;
    
    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ error: 'Invalid courier ID' }, { status: 400 });
    }

    // Get courier by ID
    const courier = await getCourierById(parseInt(id));
    
    if (!courier) {
      return NextResponse.json({ error: 'Courier not found' }, { status: 404 });
    }

    return NextResponse.json(courier);
  } catch (error) {
    console.error(`Error fetching courier with ID ${params.id}:`, error);
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

    await params;
    const { id } = params;
    
    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ error: 'Invalid courier ID' }, { status: 400 });
    }

    // Get request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ error: 'Courier name is required' }, { status: 400 });
    }

    // Update courier
    const courier = await updateCourier(parseInt(id), body);
    
    if (!courier) {
      return NextResponse.json({ error: 'Failed to update courier' }, { status: 500 });
    }

    return NextResponse.json(courier);
  } catch (error) {
    console.error(`Error updating courier with ID ${params.id}:`, error);
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

    await params;
    const { id } = params;
    
    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ error: 'Invalid courier ID' }, { status: 400 });
    }

    // Delete courier
    const success = await deleteCourier(parseInt(id));
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete courier' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting courier with ID ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to delete courier' }, { status: 500 });
  }
}
