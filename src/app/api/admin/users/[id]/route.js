import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { updateAdminUser, deleteAdminUser } from '@/lib/actions/users';

// PUT handler to update an admin user
export async function PUT(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user ID from params
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email) {
      return NextResponse.json({ 
        error: 'First name, last name, and email are required' 
      }, { status: 400 });
    }

    // Update admin user
    const result = await updateAdminUser(id, body);
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Admin user updated successfully',
      user: result.user
    });
  } catch (error) {
    console.error('Error updating admin user:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to update admin user' 
    }, { status: 500 });
  }
}

// DELETE handler to delete an admin user
export async function DELETE(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user ID from params
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Delete admin user
    const result = await deleteAdminUser(id);
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Admin user deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting admin user:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to delete admin user' 
    }, { status: 500 });
  }
}
