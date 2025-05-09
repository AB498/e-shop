import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { initializePathaoCourier, initializeInternalCourier } from '@/lib/actions/couriers';

// POST handler to initialize both courier systems
export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Initialize Pathao courier
    const pathaoCourier = await initializePathaoCourier();
    
    // Initialize internal courier
    const internalCourier = await initializeInternalCourier();
    
    if (!pathaoCourier || !internalCourier) {
      return NextResponse.json({ 
        error: 'Failed to initialize one or more courier systems',
        pathao: pathaoCourier ? 'success' : 'failed',
        internal: internalCourier ? 'success' : 'failed'
      }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Courier systems initialized successfully',
      pathao: pathaoCourier,
      internal: internalCourier
    });
  } catch (error) {
    console.error('Error initializing courier systems:', error);
    return NextResponse.json({ error: 'Failed to initialize courier systems' }, { status: 500 });
  }
}
