import { NextRequest, NextResponse } from 'next/server';
import { 
  hashPassword, 
  generateToken, 
  validateEmail, 
  validatePassword,
  generateEmailVerificationToken,
  createAuditLog
} from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { User } from '@/models/User';

// Helper function to get client IP and User Agent
function getClientInfo(request: NextRequest) {
  const ipAddress = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  return { ipAddress, userAgent };
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Registration API - Starting registration process...');
    
    const { name, email, password, role = 'student' } = await request.json();
    const { ipAddress, userAgent } = getClientInfo(request);

    // Input validation
    console.log('🔍 Registration API - Validating input...');
    if (!name || !email || !password) {
      console.log('❌ Registration API - Missing required fields');
      return NextResponse.json(
        { 
          error: 'Name, email, and password are required',
          code: 'MISSING_FIELDS'
        },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      console.log('❌ Registration API - Invalid email format');
      return NextResponse.json(
        { 
          error: 'Invalid email format or domain not allowed',
          code: 'INVALID_EMAIL'
        },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      console.log('❌ Registration API - Password validation failed');
      return NextResponse.json(
        { 
          error: 'Password validation failed',
          details: passwordValidation.errors,
          strength: passwordValidation.strength,
          code: 'WEAK_PASSWORD'
        },
        { status: 400 }
      );
    }

    // Validate role
    const allowedRoles = ['student', 'faculty'];
    if (!allowedRoles.includes(role)) {
      console.log('❌ Registration API - Invalid role');
      return NextResponse.json(
        { 
          error: 'Invalid role. Only student and faculty registrations are allowed',
          code: 'INVALID_ROLE'
        },
        { status: 400 }
      );
    }

    console.log('✅ Registration API - Input validation passed');

    // Connect to MongoDB
    console.log('🔄 Registration API - Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Registration API - MongoDB connected');

    // Check if user already exists
    console.log('🔍 Registration API - Checking for existing user...');
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('❌ Registration API - User already exists');
      
      // Log failed registration attempt
      const auditLog = createAuditLog({
        email: email.toLowerCase(),
        action: 'register',
        success: false,
        ipAddress,
        userAgent,
        details: { reason: 'User already exists' }
      });
      console.log('📝 Audit Log:', auditLog);

      return NextResponse.json(
        { 
          error: 'User with this email already exists',
          code: 'USER_EXISTS'
        },
        { status: 409 }
      );
    }

    // Parse name into first and last name
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Hash password
    console.log('🔒 Registration API - Hashing password...');
    const hashedPassword = await hashPassword(password);

    // Generate email verification token
    const emailVerificationToken = generateEmailVerificationToken();

    // Create new user
    console.log('👤 Registration API - Creating new user...');
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      emailVerificationToken,
      profile: {
        firstName,
        lastName,
        academic: role === 'student' ? {
          program: 'MTech Data Science',
          department: 'Computer Science',
          semester: 1
        } : undefined,
        professional: role === 'faculty' ? {
          department: 'Computer Science'
        } : undefined
      },
      preferences: {
        notifications: {
          email: true,
          push: true,
          sms: false,
          assignment: true,
          course: true,
          announcement: true,
          deadline: true
        },
        privacy: {
          profileVisibility: 'college-only',
          showEmail: false,
          showPhone: false,
          showSocialLinks: true
        },
        display: {
          theme: 'light',
          language: 'en',
          timezone: 'Asia/Kolkata',
          dateFormat: 'DD/MM/YYYY',
          timeFormat: '12h'
        },
        dashboard: {
          defaultView: 'grid',
          showStats: true,
          compactMode: false
        }
      },
      metadata: {
        source: 'web_registration',
        ipAddress,
        userAgent
      }
    });

    const savedUser = await newUser.save();
    console.log('✅ Registration API - User created successfully');

    // Generate authentication token
    console.log('🎫 Registration API - Generating token...');
    const token = generateToken({
      userId: savedUser._id.toString(),
      email: savedUser.email,
      role: savedUser.role,
      name: savedUser.name
    });

    // Log successful registration
    const auditLog = createAuditLog({
      userId: savedUser._id.toString(),
      email: savedUser.email,
      action: 'register',
      success: true,
      ipAddress,
      userAgent,
      details: { role: savedUser.role }
    });
    console.log('📝 Audit Log:', auditLog);

    console.log('🎉 Registration API - Registration completed successfully');

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: savedUser._id.toString(),
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        profile: {
          firstName: savedUser.profile.firstName,
          lastName: savedUser.profile.lastName,
          academic: savedUser.profile.academic,
          professional: savedUser.profile.professional
        },
        emailVerified: savedUser.emailVerified,
        isActive: savedUser.isActive
      },
      token,
      passwordStrength: passwordValidation.strength
    }, { status: 201 });

  } catch (error) {
    console.error('💥 Registration API - Error:', error);
    
    // Log failed registration
    try {
      const { ipAddress, userAgent } = getClientInfo(request);
      const body = await request.json().catch(() => ({}));
      const auditLog = createAuditLog({
        email: body.email || 'unknown',
        action: 'register',
        success: false,
        ipAddress,
        userAgent,
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
      console.log('📝 Error Audit Log:', auditLog);
    } catch (logError) {
      console.error('Failed to create audit log:', logError);
    }

    return NextResponse.json(
      { 
        error: 'Internal server error during registration',
        code: 'INTERNAL_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 