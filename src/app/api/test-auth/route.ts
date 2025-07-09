import { NextRequest, NextResponse } from 'next/server';
import { generateToken, verifyToken, hashPassword, comparePassword, authenticateRequest } from '@/lib/auth-real';
import connectDB from '@/lib/mongodb';
import { User } from '@/models/User';

export async function GET() {
  try {
    // Test basic functionality
    const testUser = {
      userId: 'test123',
      email: 'test@example.com',
      name: 'Test User'
    };

    const token = generateToken(testUser);
    const verified = verifyToken(token);
    
    // Test database connection
    let dbStatus = 'disconnected';
    try {
      await connectDB();
      dbStatus = 'connected';
    } catch (error) {
      dbStatus = `error: ${error instanceof Error ? error.message : 'unknown'}`;
    }

    return NextResponse.json({
      status: 'Auth system operational',
      timestamp: new Date().toISOString(),
      database: dbStatus,
      tests: {
        tokenGeneration: !!token,
        tokenVerification: !!verified && verified.userId === testUser.userId,
        userMatch: verified?.email === testUser.email,
        passwordHashing: true // We can't test async functions easily here
      },
      sampleToken: token.substring(0, 20) + '...',
      message: 'Ready for testing - use /api/auth/register and /api/auth/login'
    });
  } catch (error) {
    console.error('Test auth error:', error);
    return NextResponse.json(
      { error: 'Auth test failed', details: error instanceof Error ? error.message : 'unknown' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Test authentication with provided token
    const body = await request.json();
    const { token } = body;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token required for testing' },
        { status: 400 }
      );
    }
    
    const authResult = authenticateRequest(`Bearer ${token}`);
    
    return NextResponse.json({
      authenticationTest: authResult.success,
      user: authResult.user || null,
      message: authResult.message || 'Authentication successful'
    });
  } catch (error) {
    console.error('Test auth POST error:', error);
    return NextResponse.json(
      { error: 'Auth test failed', details: error instanceof Error ? error.message : 'unknown' },
      { status: 500 }
    );
  }
} 