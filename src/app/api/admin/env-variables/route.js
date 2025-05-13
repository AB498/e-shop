import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET handler to retrieve environment variables
export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Return only specific environment variables that we want to expose
    const envVariables = {
      PATHAO_API_KEY: process.env.PATHAO_CLIENT_ID || '',
      PATHAO_API_SECRET: process.env.PATHAO_CLIENT_SECRET || '',
      SSLCOMMERZ_STORE_ID: process.env.SSLCOMMERZ_STORE_ID || '',
      SSLCOMMERZ_STORE_PASSWORD: process.env.SSLCOMMERZ_STORE_PASSWORD || '',
      S3_ACCESS_KEY: process.env.S3_ACCESS_KEY || '',
      S3_SECRET_KEY: process.env.S3_SECRET_KEY || '',
      S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || '',
      S3_REGION: process.env.S3_REGION || ''
    };
    
    return NextResponse.json(envVariables);
  } catch (error) {
    console.error('Error retrieving environment variables:', error);
    return NextResponse.json({ error: 'Failed to retrieve environment variables' }, { status: 500 });
  }
}
