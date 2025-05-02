import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { runMigration } from '@/db/migrations/convert-courier-status-to-text';

export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Run migration
    const result = await runMigration();
    
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }

    return NextResponse.json({ message: result.message });
  } catch (error) {
    console.error('Error running migration:', error);
    return NextResponse.json({ error: 'Failed to run migration: ' + error.message }, { status: 500 });
  }
}
