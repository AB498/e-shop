import { NextResponse } from 'next/server';
import { createContactMessage } from '@/lib/actions/contact-messages';

export async function POST(request) {
  try {
    // Get request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ 
        error: 'Name, email, and message are required' 
      }, { status: 400 });
    }

    // Create contact message
    const message = await createContactMessage(body);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Your message has been sent successfully. We\'ll get back to you soon!' 
    });
  } catch (error) {
    console.error('Error creating contact message:', error);
    return NextResponse.json({
      error: error.message || 'Failed to send message'
    }, { status: 500 });
  }
}
