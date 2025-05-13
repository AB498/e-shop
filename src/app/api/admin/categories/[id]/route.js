import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getCategoryById, updateCategory, deleteCategory } from '@/lib/actions/categories';

// GET handler to fetch a specific category
export async function GET(request, props) {
  const params = await props.params;
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
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
    }

    // Get category by ID
    const category = await getCategoryById(parseInt(id));
    
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error(`Error fetching category with ID ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}

// PUT handler to update a category
export async function PUT(request, props) {
  const params = await props.params;
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
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
    }

    // Get request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    // Update category
    const category = await updateCategory(parseInt(id), body);
    
    if (!category) {
      return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error(`Error updating category with ID ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE handler to delete a category
export async function DELETE(request, props) {
  const params = await props.params;
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
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
    }

    // Delete category
    const success = await deleteCategory(parseInt(id));
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting category with ID ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
