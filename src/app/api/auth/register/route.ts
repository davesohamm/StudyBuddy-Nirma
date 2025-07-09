import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, generateToken, validateEmail, validatePassword } from '@/lib/auth-real';
import { addMockUser, findMockUser, logMockOperation } from '@/lib/mock-storage';

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
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
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

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: 'Password validation failed', details: passwordValidation.errors },
        { status: 400 }
      );
    }

    // Try MongoDB first, fall back to mock storage
    const canUseMongoDB = await tryConnectDB();
    const User = await tryGetUserModel();

    if (canUseMongoDB && User) {
      // MongoDB is available - use it
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
          return NextResponse.json(
            { error: 'User with this email already exists' },
            { status: 409 }
          );
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create new user
        const newUser = new User({
          name,
          email: email.toLowerCase(),
          password: hashedPassword,
          profile: {
            studentId: `STU${Date.now()}`,
            department: 'Computer Science',
            semester: 1
          }
        });

        await newUser.save();

        // Generate token
        const token = generateToken({
          userId: newUser._id.toString(),
          email: newUser.email,
          name: newUser.name
        });

        return NextResponse.json({
          success: true,
          message: 'User registered successfully with MongoDB',
          user: {
            id: newUser._id.toString(),
            name: newUser.name,
            email: newUser.email
          },
          token
        }, { status: 201 });
        
      } catch (dbError) {
        console.error('MongoDB operation failed, falling back to mock storage:', dbError);
        // Fall through to mock storage
      }
    }

    // Use mock storage (fallback)
    const existingUser = findMockUser(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user in mock storage
    const newUser = {
      _id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      profile: {
        studentId: `STU${Date.now()}`,
        department: 'Computer Science',
        semester: 1
      },
      isActive: true,
      createdAt: new Date()
    };

    addMockUser(newUser);
    logMockOperation('Registration', newUser.email);

    // Generate token
    const token = generateToken({
      userId: newUser._id,
      email: newUser.email,
      name: newUser.name
    });

    return NextResponse.json({
      success: true,
      message: 'User registered successfully (using fallback storage)',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      },
      token
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 