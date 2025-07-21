import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

// GET /api/profile - Get user profile
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Profile API - Starting profile fetch...');

    // Authenticate request
    const authResult = authenticateRequest(request);
    if (!authResult.success || !authResult.user) {
      console.log('❌ Profile API - Authentication failed');
      return NextResponse.json(
        { 
          error: 'Authentication required',
          code: 'UNAUTHORIZED'
        },
        { status: 401 }
      );
    }

    console.log('✅ Profile API - User authenticated:', authResult.user.userId);

    // Connect to MongoDB
    console.log('🔄 Profile API - Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Profile API - MongoDB connected');

    // Find user by ID
    console.log('🔍 Profile API - Finding user...');
    const user = await User.findById(authResult.user.userId);
    
    if (!user) {
      console.log('❌ Profile API - User not found');
      return NextResponse.json(
        { 
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    console.log('✅ Profile API - User found:', user.email);

    // Return user profile data
    const profileData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      isActive: user.isActive,
      profile: {
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        avatar: user.profile.avatar,
        bio: user.profile.bio,
        phone: user.profile.phone,
        address: user.profile.address,
        academic: user.profile.academic,
        professional: user.profile.professional,
        dateOfBirth: user.profile.dateOfBirth,
        gender: user.profile.gender,
        nationality: user.profile.nationality,
        languages: user.profile.languages,
        skills: user.profile.skills,
        interests: user.profile.interests,
        achievements: user.profile.achievements,
        socialLinks: user.profile.socialLinks,
        emergencyContact: user.profile.emergencyContact
      },
      preferences: user.preferences,
      lastLogin: user.lastLogin,
      lastActivity: user.lastActivity,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    console.log('🎉 Profile API - Profile data prepared successfully');

    return NextResponse.json({
      success: true,
      user: profileData
    });

  } catch (error) {
    console.error('💥 Profile API - Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT /api/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    console.log('🔄 Profile API - Starting profile update...');

    // Authenticate request
    const authResult = authenticateRequest(request);
    if (!authResult.success || !authResult.user) {
      console.log('❌ Profile API - Authentication failed');
      return NextResponse.json(
        { 
          error: 'Authentication required',
          code: 'UNAUTHORIZED'
        },
        { status: 401 }
      );
    }

    console.log('✅ Profile API - User authenticated:', authResult.user.userId);

    // Parse request body
    const updateData = await request.json();
    console.log('📝 Profile API - Update data received');

    // Connect to MongoDB
    console.log('🔄 Profile API - Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Profile API - MongoDB connected');

    // Find and update user
    console.log('🔍 Profile API - Finding and updating user...');
    const user = await User.findById(authResult.user.userId);
    
    if (!user) {
      console.log('❌ Profile API - User not found');
      return NextResponse.json(
        { 
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // Update fields safely
    if (updateData.profile) {
      // Update profile fields
      Object.keys(updateData.profile).forEach(key => {
        if (updateData.profile[key] !== undefined) {
          if (key === 'academic' || key === 'professional' || key === 'address' || key === 'socialLinks' || key === 'emergencyContact') {
            // Handle nested objects
            user.profile[key] = { ...user.profile[key], ...updateData.profile[key] };
          } else {
            user.profile[key] = updateData.profile[key];
          }
        }
      });
    }

    if (updateData.preferences) {
      // Update preferences
      Object.keys(updateData.preferences).forEach(key => {
        if (updateData.preferences[key] !== undefined) {
          if (typeof updateData.preferences[key] === 'object') {
            user.preferences[key] = { ...user.preferences[key], ...updateData.preferences[key] };
          } else {
            user.preferences[key] = updateData.preferences[key];
          }
        }
      });
    }

    // Update name if firstName or lastName changed
    if (user.profile.firstName && user.profile.lastName) {
      user.name = `${user.profile.firstName} ${user.profile.lastName}`;
    }

    // Save updated user
    const updatedUser = await user.save();
    console.log('✅ Profile API - User updated successfully');

    // Return updated profile data
    const profileData = {
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      emailVerified: updatedUser.emailVerified,
      isActive: updatedUser.isActive,
      profile: {
        firstName: updatedUser.profile.firstName,
        lastName: updatedUser.profile.lastName,
        avatar: updatedUser.profile.avatar,
        bio: updatedUser.profile.bio,
        phone: updatedUser.profile.phone,
        address: updatedUser.profile.address,
        academic: updatedUser.profile.academic,
        professional: updatedUser.profile.professional,
        dateOfBirth: updatedUser.profile.dateOfBirth,
        gender: updatedUser.profile.gender,
        nationality: updatedUser.profile.nationality,
        languages: updatedUser.profile.languages,
        skills: updatedUser.profile.skills,
        interests: updatedUser.profile.interests,
        achievements: updatedUser.profile.achievements,
        socialLinks: updatedUser.profile.socialLinks,
        emergencyContact: updatedUser.profile.emergencyContact
      },
      preferences: updatedUser.preferences,
      lastLogin: updatedUser.lastLogin,
      lastActivity: updatedUser.lastActivity,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };

    console.log('🎉 Profile API - Profile update completed successfully');

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: profileData
    });

  } catch (error) {
    console.error('💥 Profile API - Update error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error during profile update',
        code: 'INTERNAL_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

 