import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { authenticateRequest } from '@/lib/auth';

export async function PUT(req: NextRequest) {
  try {
    console.log('🔄 Profile Section API - Starting section update...');
    
    // Authenticate user
    const authResult = await authenticateRequest(req);
    if (!authResult.success) {
      console.log('❌ Profile Section API - Authentication failed:', authResult.message);
      return NextResponse.json(
        { error: authResult.message || 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = authResult.user?.userId;
    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid authentication data' },
        { status: 401 }
      );
    }
    
    console.log('✅ Profile Section API - User authenticated:', userId);

    // Connect to database
    await connectDB();
    console.log('✅ Profile Section API - Database connected');

    // Parse request body
    const { section, data } = await req.json();
    console.log('📝 Profile Section API - Section:', section, 'Data keys:', Object.keys(data || {}));

    if (!section || !data) {
      return NextResponse.json(
        { error: 'Section and data are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      console.log('❌ Profile Section API - User not found:', userId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('✅ Profile Section API - User found, updating section:', section);

    // Update specific section based on section type
    let updateQuery: any = {};
    
    switch (section) {
      case 'personal':
        if (data.profile) {
          updateQuery = {
            'profile.firstName': data.profile.firstName,
            'profile.lastName': data.profile.lastName,
            'profile.bio': data.profile.bio,
            'profile.dateOfBirth': data.profile.dateOfBirth,
            'profile.nationality': data.profile.nationality,
            'name': `${data.profile.firstName || ''} ${data.profile.lastName || ''}`.trim() || user.name
          };
          
          // Only include gender if it's not empty string to avoid validation error
          if (data.profile.gender && data.profile.gender.trim() !== '') {
            updateQuery['profile.gender'] = data.profile.gender;
          }
        }
        break;

      case 'academic':
        if (data.profile?.academic) {
          const academic = data.profile.academic;
          updateQuery = {
            'profile.academic.studentId': academic.studentId,
            'profile.academic.semester': academic.semester,
            'profile.academic.program': academic.program,
            'profile.academic.department': academic.department,
            'profile.academic.enrollmentYear': academic.enrollmentYear,
            'profile.academic.cgpa': academic.cgpa,
          };
        }
        break;

      case 'contact':
        if (data.profile) {
          updateQuery = {
            'profile.phone': data.profile.phone,
            'profile.address.street': data.profile.address?.street,
            'profile.address.city': data.profile.address?.city,
            'profile.address.state': data.profile.address?.state,
            'profile.address.country': data.profile.address?.country,
            'profile.address.zipCode': data.profile.address?.zipCode,
          };
        }
        break;

      case 'social':
        if (data.profile?.socialLinks) {
          const socialLinks = data.profile.socialLinks;
          updateQuery = {
            'profile.socialLinks.linkedin': socialLinks.linkedin,
            'profile.socialLinks.github': socialLinks.github,
            'profile.socialLinks.twitter': socialLinks.twitter,
            'profile.socialLinks.portfolio': socialLinks.portfolio,
          };
        }
        break;

      case 'interests':
        if (data.profile) {
          updateQuery = {
            'profile.interests': data.profile.interests,
            'profile.skills': data.profile.skills,
            'profile.languages': data.profile.languages,
            'profile.achievements': data.profile.achievements,
          };
        }
        break;

      case 'settings':
        if (data.preferences) {
          updateQuery = {
            'preferences.notifications.email': data.preferences.notifications?.email,
            'preferences.notifications.push': data.preferences.notifications?.push,
            'preferences.notifications.sms': data.preferences.notifications?.sms,
            'preferences.privacy.profileVisibility': data.preferences.privacy?.profileVisibility,
            'preferences.privacy.showEmail': data.preferences.privacy?.showEmail,
            'preferences.privacy.showPhone': data.preferences.privacy?.showPhone,
          };
        }
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid section' },
          { status: 400 }
        );
    }

    // Remove undefined and null values from updateQuery
    const cleanUpdateQuery = Object.fromEntries(
      Object.entries(updateQuery).filter(([key, value]) => 
        value !== undefined && value !== null
      )
    );

    console.log('📝 Profile Section API - Clean update query:', Object.keys(cleanUpdateQuery));

    // Update user with the section data
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        $set: {
          ...cleanUpdateQuery,
          lastActivity: new Date()
        }
      },
      { 
        new: true,
        runValidators: true,
        projection: { password: 0, emailVerificationToken: 0, passwordResetToken: 0 }
      }
    );

    if (!updatedUser) {
      console.log('❌ Profile Section API - Failed to update user');
      return NextResponse.json(
        { error: 'Failed to update profile section' },
        { status: 500 }
      );
    }

    console.log('✅ Profile Section API - Section updated successfully');

    // Return updated user data
    const profileData = {
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      emailVerified: updatedUser.emailVerified,
      isActive: updatedUser.isActive,
      profile: updatedUser.profile,
      preferences: updatedUser.preferences,
      lastLogin: updatedUser.lastLogin,
      lastActivity: updatedUser.lastActivity,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };

    return NextResponse.json({
      success: true,
      message: `${section.charAt(0).toUpperCase() + section.slice(1)} section updated successfully`,
      user: profileData
    });

  } catch (error) {
    console.error('❌ Profile Section API Error:', error);
    
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { error: 'Invalid data provided' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 