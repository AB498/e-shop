import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getAllContactMessages, getContactMessageStats } from '@/lib/actions/contact-messages';

export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : 100;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')) : 0;
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const stats = searchParams.get('stats') === 'true';

    // Get contact messages or stats
    if (stats) {
      const messageStats = await getContactMessageStats();
      return NextResponse.json(messageStats);
    } else {
      const messages = await getAllContactMessages({
        status,
        limit,
        offset,
        sortBy,
        sortOrder
      });
      return NextResponse.json(messages);
    }
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return NextResponse.json({ error: 'Failed to fetch contact messages' }, { status: 500 });
  }
}
