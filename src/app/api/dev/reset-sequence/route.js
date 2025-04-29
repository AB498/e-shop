import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(request) {
  try {
    // Get the table name from the request
    const { table } = await request.json();
    
    if (!table) {
      return NextResponse.json(
        { error: 'Table name is required' },
        { status: 400 }
      );
    }
    
    // Reset the sequence for the specified table
    const result = await pool.query(`
      SELECT setval(pg_get_serial_sequence('${table}', 'id'), 
        (SELECT COALESCE(MAX(id), 0) + 1 FROM ${table}), false);
    `);
    
    return NextResponse.json({
      success: true,
      message: `Sequence for table ${table} has been reset`,
      result: result.rows[0]
    });
  } catch (error) {
    console.error('Error resetting sequence:', error);
    return NextResponse.json(
      { error: `Failed to reset sequence: ${error.message}` },
      { status: 500 }
    );
  }
}
