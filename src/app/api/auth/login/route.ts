import { NextRequest, NextResponse } from 'next/server';
import { comparePassword, generateToken, validateEmail } from '@/lib/auth-real';
import { getAllMockUsers, logMockOperation } from '@/lib/mock-storage';

async function tryConnectDB() {
  try {
    const { default: connectDB } = await import('@/lib/mongodb');
    await connectDB();
    return true;
  } catch (error) {
    console.warn('MongoDB connection failed, using mock storage:', error);
    return false;
  }
}

async function tryGetUserModel() {
  try {
    const { User } = await import('@/models/User');
    return User;
  } catch (error) {
    console.warn('User model failed to load:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Try MongoDB first, fall back to mock storage
    const canUseMongoDB = await tryConnectDB();
    const User = await tryGetUserModel();

    if (canUseMongoDB && User) {
      // MongoDB is available - use it
      try {
        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
          return NextResponse.json(
            { error: 'Invalid email or password' },
            { status: 401 }
          );
        }

        // Check password
        const isValidPassword = await comparePassword(password, user.password);
        if (!isValidPassword) {
          return NextResponse.json(
            { error: 'Invalid email or password' },
            { status: 401 }
          );
        }

        // Check if user is active
        if (!user.isActive) {
          return NextResponse.json(
            { error: 'Account is deactivated. Please contact administrator.' },
            { status: 401 }
          );
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = generateToken({
          userId: user._id.toString(),
          email: user.email,
          name: user.name
        });

        return NextResponse.json({
          success: true,
          message: 'Login successful with MongoDB',
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            profile: user.profile
          },
          token
        });
        
      } catch (dbError) {
        console.error('MongoDB operation failed, falling back to mock storage:', dbError);
        // Fall through to mock storage
      }
    }

    // Use mock storage (fallback)
    const mockUsers = getAllMockUsers();
    const user = mockUsers.find(u => u.email === email.toLowerCase() && u.isActive);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update last login
    user.lastLogin = new Date();
    logMockOperation('Login', user.email);

    // Generate token
    const token = generateToken({
      userId: user._id,
      email: user.email,
      name: user.name
    });

    return NextResponse.json({
      success: true,
      message: 'Login successful (using fallback storage)',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 