import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-real';
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

// GET /api/profile - Get user profile
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Try MongoDB first, fall back to mock storage
    const canUseMongoDB = await tryConnectDB();
    const User = await tryGetUserModel();

    if (canUseMongoDB && User) {
      try {
        const user = await User.findById(payload.userId);
        if (!user) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          user: {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            profile: user.profile,
            settings: user.settings,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          }
        });
      } catch (dbError) {
        console.error('MongoDB operation failed, falling back to mock storage:', dbError);
      }
    }

    // Use mock storage (fallback)
    const mockUsers = getAllMockUsers();
    const user = mockUsers.find(u => u._id === payload.userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    logMockOperation('Profile Fetch', user.email);

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile || {},
        settings: user.settings || {
          notifications: true,
          emailNotifications: true,
          smsNotifications: false,
          theme: 'light',
          language: 'en',
          timezone: 'UTC',
          privacy: {
            profileVisibility: 'public',
            showEmail: false,
            showPhone: false,
            showAddress: false
          }
        },
        createdAt: user.createdAt,
        updatedAt: user.updatedAt || user.createdAt
      }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const updateData = await request.json();

    // Validate required fields
    if (!updateData.name || !updateData.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Try MongoDB first, fall back to mock storage
    const canUseMongoDB = await tryConnectDB();
    const User = await tryGetUserModel();

    if (canUseMongoDB && User) {
      try {
        const user = await User.findById(payload.userId);
        if (!user) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }

        // Update user data
        user.name = updateData.name;
        user.email = updateData.email;
        user.profile = { ...user.profile, ...updateData.profile };
        user.settings = { ...user.settings, ...updateData.settings };

        await user.save();

        return NextResponse.json({
          success: true,
          message: 'Profile updated successfully with MongoDB',
          user: {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            profile: user.profile,
            settings: user.settings
          }
        });
      } catch (dbError) {
        console.error('MongoDB operation failed, falling back to mock storage:', dbError);
      }
    }

    // Use mock storage (fallback)
    const mockUsers = getAllMockUsers();
    const userIndex = mockUsers.findIndex(u => u._id === payload.userId);
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user in mock storage
    const user = mockUsers[userIndex];
    user.name = updateData.name;
    user.email = updateData.email;
    user.profile = { ...user.profile, ...updateData.profile };
    user.settings = { ...user.settings, ...updateData.settings };
    user.updatedAt = new Date();

    logMockOperation('Profile Update', user.email);

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully (using fallback storage)',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile,
        settings: user.settings
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/profile - Delete user profile (optional CRUD operation)
export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Try MongoDB first, fall back to mock storage
    const canUseMongoDB = await tryConnectDB();
    const User = await tryGetUserModel();

    if (canUseMongoDB && User) {
      try {
        const user = await User.findByIdAndDelete(payload.userId);
        if (!user) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Profile deleted successfully'
        });
      } catch (dbError) {
        console.error('MongoDB operation failed, falling back to mock storage:', dbError);
      }
    }

    // Use mock storage (fallback)
    const mockUsers = getAllMockUsers();
    const userIndex = mockUsers.findIndex(u => u._id === payload.userId);
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = mockUsers[userIndex];
    mockUsers.splice(userIndex, 1);

    logMockOperation('Profile Delete', user.email);

    return NextResponse.json({
      success: true,
      message: 'Profile deleted successfully (using fallback storage)'
    });

  } catch (error) {
    console.error('Profile delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 