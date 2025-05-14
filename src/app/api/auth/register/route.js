import { NextResponse } from 'next/server';
import { createUser } from '@/lib/auth';
import { pool } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();

    console.log('Registration request body:', body);

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'password'];
    for (const field of requiredFields) {
      if (!body[field]) {
        console.log(`Missing required field: ${field}`);
        return NextResponse.json(
          { error: `${field.charAt(0).toUpperCase() + field.slice(1)} is required` },
          { status: 400 }
        );
      }
    }

    // Reset the sequence for the users table to avoid primary key conflicts
    try {
      await pool.query(`
        SELECT setval(pg_get_serial_sequence('users', 'id'),
          (SELECT COALESCE(MAX(id), 0) + 1 FROM users), false);
      `);
      console.log('Users table sequence has been reset');
    } catch (seqError) {
      console.error('Error resetting sequence:', seqError);
      // Continue anyway, as this is just a precaution
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+৳/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (body.password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Create user
    const result = await createUser(body);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'User registered successfully', user: result.user },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'An error occurred while registering the user' },
      { status: 500 }
    );
  }
}
