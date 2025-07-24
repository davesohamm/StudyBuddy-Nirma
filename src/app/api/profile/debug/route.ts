import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '../../../../lib/auth';
import { connectDB } from '../../../../lib/mongodb';
import { User } from '../../../../models/User';

// Force dynamic route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Authenticate request
    const authResult = authenticateRequest(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Connect to MongoDB
    await connectDB();

    // Find user
    const user = await User.findById(authResult.user.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return debug info
    return NextResponse.json({
      success: true,
      debug: {
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        profileStructure: {
          firstName: user.profile?.firstName,
          lastName: user.profile?.lastName,
          bio: user.profile?.bio,
          academic: user.profile?.academic,
          address: user.profile?.address,
          preferences: user.preferences
        },
        rawProfile: user.profile,
        rawPreferences: user.preferences
      }
    });

  } catch (error) {
    console.error('Debug API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 