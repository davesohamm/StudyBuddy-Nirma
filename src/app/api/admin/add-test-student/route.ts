import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import { User } from '../../../../models/User';
import { authenticateRequest } from '../../../../lib/auth';
import { hashPassword } from '../../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Adding test student...');
    
    // Authenticate admin
    const authResult = authenticateRequest(request);
    if (!authResult.success || authResult.user?.role !== 'admin') {
      return NextResponse.json({
        success: false,
        message: 'Admin access required'
      }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { email, name } = body;

    if (!email || !name) {
      return NextResponse.json({
        success: false,
        message: 'Email and name are required'
      }, { status: 400 });
    }

    console.log('📧 Creating test student:', { email, name });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      // Update existing user to be a verified student
      console.log('👤 User exists, updating to verified student...');
      
      const updatedUser = await User.findOneAndUpdate(
        { email },
        {
          role: 'student',
          emailVerified: true,
          isActive: true,
          isVerified: true,
          'profile.firstName': name.split(' ')[0] || name,
          'profile.lastName': name.split(' ')[1] || 'Student'
        },
        { new: true }
      );

      console.log('✅ User updated to verified student:', updatedUser.email);

      return NextResponse.json({
        success: true,
        message: 'Existing user updated to verified student',
        data: {
          id: updatedUser._id,
          email: updatedUser.email,
          role: updatedUser.role,
          emailVerified: updatedUser.emailVerified,
          name: updatedUser.name
        }
      });
    } else {
      // Create new test student
      console.log('➕ Creating new test student...');
      
      const hashedPassword = await hashPassword('password123');

      const newStudent = new User({
        name: name,
        email: email,
        password: hashedPassword,
        role: 'student',
        emailVerified: true,
        isActive: true,
        isVerified: true,
        profile: {
          firstName: name.split(' ')[0] || name,
          lastName: name.split(' ')[1] || 'Student',
          phone: '+91-9999999999',
          dateOfBirth: new Date('2000-01-01'),
          gender: '',
          academic: {
            studentId: 'TEST001',
            program: 'MTech Data Science',
            department: 'Computer Science',
            semester: 4,
            batch: '2023-2025',
            cgpa: 8.5
          }
        },
        preferences: {
          notifications: {
            email: true,
            push: true,
            assignment: true,
            course: true,
            announcement: true,
            deadline: true
          },
          privacy: {
            profileVisibility: 'college-only',
            showEmail: true,
            showPhone: false,
            showSocialLinks: true
          },
          display: {
            theme: 'light',
            language: 'en',
            timezone: 'Asia/Kolkata',
            dateFormat: 'DD/MM/YYYY',
            timeFormat: '24h'
          },
          dashboard: {
            defaultView: 'grid',
            showStats: true,
            compactMode: false
          }
        }
      });

      await newStudent.save();
      console.log('✅ New test student created:', newStudent.email);

      return NextResponse.json({
        success: true,
        message: 'Test student created successfully',
        data: {
          id: newStudent._id,
          email: newStudent.email,
          role: newStudent.role,
          emailVerified: newStudent.emailVerified,
          name: newStudent.name,
          password: 'password123'
        }
      });
    }

  } catch (error) {
    console.error('❌ Failed to add test student:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to add test student',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 