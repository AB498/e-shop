import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getDeliveryPersonById, updateDeliveryPerson, deleteDeliveryPerson } from '@/lib/actions/delivery-persons';

// GET handler to fetch a delivery person by ID
export async function GET(request, props) {
  const params = await props.params;
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid delivery person ID' }, { status: 400 });
    }

    // Get delivery person by ID
    const deliveryPerson = await getDeliveryPersonById(id);
    
    if (!deliveryPerson) {
      return NextResponse.json({ error: 'Delivery person not found' }, { status: 404 });
    }

    return NextResponse.json(deliveryPerson);
  } catch (error) {
    console.error(`Error fetching delivery person ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch delivery person' }, { status: 500 });
  }
}

// PUT handler to update a delivery person
export async function PUT(request, props) {
  const params = await props.params;
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid delivery person ID' }, { status: 400 });
    }

    // Get request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
    }

    // Update delivery person
    const deliveryPerson = await updateDeliveryPerson(id, body);
    
    if (!deliveryPerson) {
      return NextResponse.json({ error: 'Failed to update delivery person' }, { status: 500 });
    }

    return NextResponse.json(deliveryPerson);
  } catch (error) {
    console.error(`Error updating delivery person ${params.id}:`, error);
    return NextResponse.json({ error: error.message || 'Failed to update delivery person' }, { status: 500 });
  }
}

// DELETE handler to delete a delivery person
export async function DELETE(request, props) {
  const params = await props.params;
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid delivery person ID' }, { status: 400 });
    }

    // Delete delivery person
    try {
      const result = await deleteDeliveryPerson(id);
      return NextResponse.json({ success: true });
    } catch (error) {
      return NextResponse.json({ error: error.message || 'Failed to delete delivery person' }, { status: 400 });
    }
  } catch (error) {
    console.error(`Error deleting delivery person ${params.id}:`, error);
    return NextResponse.json({ error: error.message || 'Failed to delete delivery person' }, { status: 500 });
  }
}
