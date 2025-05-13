import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getAllAdminUsers, createAdminUser } from '@/lib/actions/users';

// GET handler to fetch all admin users
export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all admin users
    const adminUsers = await getAllAdminUsers();
    return NextResponse.json(adminUsers);
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json({ error: 'Failed to fetch admin users' }, { status: 500 });
  }
}

// POST handler to create a new admin user
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
    if (!body.firstName || !body.lastName || !body.email || !body.password) {
      return NextResponse.json({ 
        error: 'First name, last name, email, and password are required' 
      }, { status: 400 });
    }

    // Create admin user
    const result = await createAdminUser(body);
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Admin user created successfully',
      user: result.user
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to create admin user' 
    }, { status: 500 });
  }
}
