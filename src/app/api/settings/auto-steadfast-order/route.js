import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { updateSetting, getSetting } from '@/lib/actions/settings';

/**
 * GET handler to check if automatic Steadfast order creation is enabled
 */
export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get setting
    const value = await getSetting('auto_create_steadfast_order');
    return NextResponse.json({ enabled: value === 'true' });
  } catch (error) {
    console.error('Error checking auto Steadfast order setting:', error);
    return NextResponse.json({ error: 'Failed to check setting' }, { status: 500 });
  }
}

/**
 * POST handler to update automatic Steadfast order creation setting
 */
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
    if (body.enabled === undefined) {
      return NextResponse.json({ error: 'Enabled flag is required' }, { status: 400 });
    }

    // Update setting
    const result = await updateSetting(
      'auto_create_steadfast_order',
      body.enabled ? 'true' : 'false',
      'Enable automatic Steadfast courier order creation'
    );

    if (!result) {
      return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
    }

    return NextResponse.json({ enabled: body.enabled });
  } catch (error) {
    console.error('Error updating auto Steadfast order setting:', error);
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
  }
}
