import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getAllCouriers, createCourier } from '@/lib/actions/couriers';

// GET handler to fetch all couriers
export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all couriers
    const couriers = await getAllCouriers();
    return NextResponse.json(couriers);
  } catch (error) {
    console.error('Error fetching couriers:', error);
    return NextResponse.json({ error: 'Failed to fetch couriers' }, { status: 500 });
  }
}

// POST handler to create a new courier
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
    if (!body.name) {
      return NextResponse.json({ error: 'Courier name is required' }, { status: 400 });
    }

    // Create courier
    const courier = await createCourier(body);
    
    if (!courier) {
      return NextResponse.json({ error: 'Failed to create courier' }, { status: 500 });
    }

    return NextResponse.json(courier);
  } catch (error) {
    console.error('Error creating courier:', error);
    return NextResponse.json({ error: 'Failed to create courier' }, { status: 500 });
  }
}
