import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import { User } from '../../../../models/User';
import { hashPassword } from '../../../../lib/auth';
import { config } from '../../../../lib/config';

// POST /api/admin/setup - Create the admin user
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ 
      email: config.admin.defaultAdminEmail 
    });

    if (existingAdmin) {
      return NextResponse.json({
        success: false,
        message: 'Admin user already exists',
        email: config.admin.defaultAdminEmail
      }, { status: 409 });
    }

    // Hash the admin password
    const hashedPassword = await hashPassword(config.admin.defaultAdminPassword);

    // Create admin user with comprehensive profile
    const adminUser = new User({
      name: 'Dave Soham',
      email: config.admin.defaultAdminEmail,
      password: hashedPassword,
      role: 'admin',
      emailVerified: true, // Admin is pre-verified
      profile: {
        firstName: 'Dave',
        lastName: 'Soham',
        phone: '+91-9999999999',
        dateOfBirth: new Date('1995-01-01'),
        gender: '',
        address: {
          street: 'Nirma University Campus',
          city: 'Ahmedabad',
          state: 'Gujarat',
          country: 'India',
          zipCode: '382481'
        },
        academic: {
          studentId: 'DAVE001',
          program: 'MTech Data Science',
          department: 'Computer Science',
          semester: 4,
          batch: '2023-2025',
          cgpa: 10.0
        },
        socialLinks: {
          linkedin: 'https://linkedin.com/in/dave-soham',
          github: 'https://github.com/davesohamm'
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
          profileVisibility: 'private',
          showEmail: false,
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
      },
      isActive: true,
      isVerified: true
    });

    await adminUser.save();

    console.log('✅ Admin user created successfully:', {
      email: adminUser.email,
      role: adminUser.role,
      id: adminUser._id
    });

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      data: {
        email: adminUser.email,
        role: adminUser.role,
        firstName: adminUser.profile.firstName,
        lastName: adminUser.profile.lastName,
        createdAt: adminUser.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Admin setup failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to create admin user',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET /api/admin/setup - Auto-create admin user if not exists
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Check if admin user already exists
    let adminUser = await User.findOne({ 
      email: config.admin.defaultAdminEmail 
    }).select('email role createdAt profile.firstName profile.lastName');

    if (!adminUser) {
      // Auto-create admin user
      const hashedPassword = await hashPassword(config.admin.defaultAdminPassword);

      adminUser = new User({
        name: 'Dave Soham',
        email: config.admin.defaultAdminEmail,
        password: hashedPassword,
        role: 'admin',
        emailVerified: true,
        profile: {
          firstName: 'Dave',
          lastName: 'Soham',
          phone: '+91-9999999999',
          dateOfBirth: new Date('1995-01-01'),
          gender: '',
          address: {
            street: 'Nirma University Campus',
            city: 'Ahmedabad',
            state: 'Gujarat',
            country: 'India',
            zipCode: '382481'
          },
          academic: {
            studentId: 'DAVE001',
            program: 'MTech Data Science',
            department: 'Computer Science',
            semester: 4,
            batch: '2023-2025',
            cgpa: 10.0
          },
          socialLinks: {
            linkedin: 'https://linkedin.com/in/dave-soham',
            github: 'https://github.com/davesohamm'
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
            profileVisibility: 'private',
            showEmail: false,
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
        },
        isActive: true,
        isVerified: true
      });

      await adminUser.save();

      console.log('✅ Admin user auto-created:', {
        email: adminUser.email,
        role: adminUser.role,
        id: adminUser._id
      });

      return NextResponse.json({
        success: true,
        message: 'Admin user created successfully! You can now login.',
        setupRequired: false,
        data: {
          email: adminUser.email,
          role: adminUser.role,
          firstName: adminUser.profile.firstName,
          lastName: adminUser.profile.lastName,
          createdAt: adminUser.createdAt,
          autoCreated: true
        }
      }, { status: 201 });
    }

    return NextResponse.json({
      success: true,
      message: 'Admin user already exists',
      setupRequired: false,
      data: {
        email: adminUser.email,
        role: adminUser.role,
        firstName: adminUser.profile?.firstName || 'Admin',
        lastName: adminUser.profile?.lastName || 'User',
        createdAt: adminUser.createdAt,
        autoCreated: false
      }
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Admin setup failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to setup admin user',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 