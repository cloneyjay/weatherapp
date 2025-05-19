import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Use the Laravel backend URL from environment variable
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    
    const response = await fetch(`${apiUrl}/api/weather/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Set a short timeout to avoid long waits if the API is down
      signal: AbortSignal.timeout(5000),
    });

    if (response.ok) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false });
    }
  } catch (error) {
    console.error('API connection check failed:', error);
    return NextResponse.json({ success: false });
  }
}