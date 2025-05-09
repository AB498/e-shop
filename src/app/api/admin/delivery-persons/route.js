import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getAllDeliveryPersons, createDeliveryPerson } from '@/lib/actions/delivery-persons';

// GET handler to fetch all delivery persons
export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all delivery persons
    const deliveryPersons = await getAllDeliveryPersons();
    return NextResponse.json(deliveryPersons);
  } catch (error) {
    console.error('Error fetching delivery persons:', error);
    return NextResponse.json({ error: 'Failed to fetch delivery persons' }, { status: 500 });
  }
}

// POST handler to create a new delivery person
export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
    }

    // Create delivery person
    const deliveryPerson = await createDeliveryPerson(body);
    
    if (!deliveryPerson) {
      return NextResponse.json({ error: 'Failed to create delivery person' }, { status: 500 });
    }

    return NextResponse.json(deliveryPerson);
  } catch (error) {
    console.error('Error creating delivery person:', error);
    return NextResponse.json({ error: 'Failed to create delivery person' }, { status: 500 });
  }
}
