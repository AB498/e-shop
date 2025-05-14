import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getAllSettings, updateSetting } from '@/lib/actions/settings';

// GET handler to retrieve all settings
export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all settings
    const settings = await getAllSettings();

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error retrieving settings:', error);
    return NextResponse.json({ error: 'Failed to retrieve settings' }, { status: 500 });
  }
}

// PUT handler to update a setting
export async function PUT(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const body = await request.json();

    // Validate required fields
    if (!body.key || body.value === undefined) {
      return NextResponse.json({ error: 'Key and value are required' }, { status: 400 });
    }

    console.log(`API route: Updating setting ${body.key} to ${body.value}`);

    // Update setting using the server action
    try {
      const success = await updateSetting(body.key, body.value);

      if (!success) {
        console.error(`Failed to update setting ${body.key}`);
        return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    } catch (actionError) {
      console.error('Server action error:', actionError);
      return NextResponse.json({
        error: 'Failed to update setting',
        details: actionError.message
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in settings PUT handler:', error);
    return NextResponse.json({
      error: 'Failed to update setting',
      details: error.message
    }, { status: 500 });
  }
}
