import { NextResponse } from 'next/server';
import { resetSequence, forceResetSequence } from '@/lib/utils/db-utils';

export async function POST(request) {
  try {
    // Get the table name and optional value from the request
    const { table, value } = await request.json();

    if (!table) {
      return NextResponse.json(
        { error: 'Table name is required' },
        { status: 400 }
      );
    }

    let success;

    // If a specific value is provided, use forceResetSequence
    if (value !== undefined) {
      success = await forceResetSequence(table, value);
    } else {
      // Otherwise use the standard resetSequence
      success = await resetSequence(table);
    }

    if (!success) {
      return NextResponse.json(
        { error: `Failed to reset sequence for table ${table}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Sequence for table ${table} has been reset`,
      table,
      value: value !== undefined ? value : 'auto-calculated'
    });
  } catch (error) {
    console.error('Error resetting sequence:', error);
    return NextResponse.json(
      { error: `Failed to reset sequence: ${error.message}` },
      { status: 500 }
    );
  }
}
