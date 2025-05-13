import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { 
  getContactMessageById, 
  updateContactMessage, 
  deleteContactMessage 
} from '@/lib/actions/contact-messages';

// GET handler to fetch a single contact message by ID
export async function GET(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;
    
    // Get contact message by ID
    const message = await getContactMessageById(id);
    
    if (!message) {
      return NextResponse.json({ error: 'Contact message not found' }, { status: 404 });
    }
    
    return NextResponse.json(message);
  } catch (error) {
    console.error(`Error fetching contact message with ID ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch contact message' }, { status: 500 });
  }
}

// PATCH handler to update a contact message
export async function PATCH(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;
    const body = await request.json();
    
    // Update contact message
    const updatedMessage = await updateContactMessage(id, body);
    
    if (!updatedMessage) {
      return NextResponse.json({ error: 'Contact message not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error(`Error updating contact message with ID ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to update contact message' }, { status: 500 });
  }
}

// DELETE handler to delete a contact message
export async function DELETE(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;
    
    // Delete contact message
    const success = await deleteContactMessage(id);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete contact message' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting contact message with ID ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to delete contact message' }, { status: 500 });
  }
}
