import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { initializeSteadfastCourier } from '@/lib/actions/couriers';

/**
 * POST handler to initialize Steadfast courier
 */
export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Initialize Steadfast courier
    const courier = await initializeSteadfastCourier();
    
    if (!courier) {
      return NextResponse.json({ error: 'Failed to initialize Steadfast courier' }, { status: 500 });
    }

    return NextResponse.json(courier);
  } catch (error) {
    console.error('Error initializing Steadfast courier:', error);
    return NextResponse.json({ error: 'Failed to initialize Steadfast courier' }, { status: 500 });
  }
}
