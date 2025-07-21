import { NextRequest, NextResponse } from 'next/server';
import { 
  comparePassword, 
  generateToken, 
  validateEmail,
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
    console.log('🚀 Login API - Starting login process...');
    
    const { email, password } = await request.json();
    const { ipAddress, userAgent } = getClientInfo(request);

    // Input validation
    console.log('🔍 Login API - Validating input...');
    if (!email || !password) {
      console.log('❌ Login API - Missing email or password');
      return NextResponse.json(
        { 
          error: 'Email and password are required',
          code: 'MISSING_CREDENTIALS'
        },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      console.log('❌ Login API - Invalid email format');
      return NextResponse.json(
        { 
          error: 'Invalid email format',
          code: 'INVALID_EMAIL'
        },
        { status: 400 }
      );
    }

    console.log('✅ Login API - Input validation passed');

    // Connect to MongoDB
    console.log('🔄 Login API - Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Login API - MongoDB connected');

    // Find user with password field included
    console.log('🔍 Login API - Finding user...');
    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+password +loginAttempts +lockUntil +lastPasswordChange')
      .exec();

    if (!user) {
      console.log('❌ Login API - User not found');
      
      // Log failed login attempt
      const auditLog = createAuditLog({
        email: email.toLowerCase(),
        action: 'failed_login',
        success: false,
        ipAddress,
        userAgent,
        details: { reason: 'User not found' }
      });
      console.log('📝 Audit Log:', auditLog);

      return NextResponse.json(
        { 
          error: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS'
        },
        { status: 401 }
      );
    }

    // Check if account is locked
    const isLocked = user.lockUntil && user.lockUntil > new Date();
    if (isLocked) {
      console.log('🔒 Login API - Account is locked');
      
      const auditLog = createAuditLog({
        userId: user._id.toString(),
        email: user.email,
        action: 'failed_login',
        success: false,
        ipAddress,
        userAgent,
        details: { reason: 'Account locked', lockUntil: user.lockUntil }
      });
      console.log('📝 Audit Log:', auditLog);

      return NextResponse.json(
        { 
          error: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.',
          code: 'ACCOUNT_LOCKED',
          lockUntil: user.lockUntil
        },
        { status: 423 }
      );
    }

    // Check if user account is active
    if (!user.isActive) {
      console.log('❌ Login API - Account is deactivated');
      
      const auditLog = createAuditLog({
        userId: user._id.toString(),
        email: user.email,
        action: 'failed_login',
        success: false,
        ipAddress,
        userAgent,
        details: { reason: 'Account deactivated' }
      });
      console.log('📝 Audit Log:', auditLog);

      return NextResponse.json(
        { 
          error: 'Account is deactivated. Please contact administrator.',
          code: 'ACCOUNT_DEACTIVATED'
        },
        { status: 401 }
      );
    }

    // Verify password
    console.log('🔒 Login API - Verifying password...');
    const isValidPassword = await comparePassword(password, user.password);
    
    if (!isValidPassword) {
      console.log('❌ Login API - Invalid password');
      
      // Increment login attempts
      await user.incrementLoginAttempts();
      
      // Check if account should be locked after this attempt
      const updatedUser = await User.findById(user._id).select('loginAttempts lockUntil');
      const wasLocked = updatedUser?.lockUntil && updatedUser.lockUntil > new Date();
      
      const auditLog = createAuditLog({
        userId: user._id.toString(),
        email: user.email,
        action: wasLocked ? 'account_locked' : 'failed_login',
        success: false,
        ipAddress,
        userAgent,
        details: { 
          reason: 'Invalid password',
          loginAttempts: updatedUser?.loginAttempts || 0,
          locked: wasLocked
        }
      });
      console.log('📝 Audit Log:', auditLog);

      return NextResponse.json(
        { 
          error: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS',
          ...(wasLocked && { 
            message: 'Account has been locked due to multiple failed attempts',
            lockUntil: updatedUser?.lockUntil 
          })
        },
        { status: 401 }
      );
    }

    console.log('✅ Login API - Password verified');

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    // Update last login and activity
    user.lastLogin = new Date();
    user.lastActivity = new Date();
    await user.save();

    // Generate authentication token
    console.log('🎫 Login API - Generating token...');
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name
    });

    // Log successful login
    const auditLog = createAuditLog({
      userId: user._id.toString(),
      email: user.email,
      action: 'login',
      success: true,
      ipAddress,
      userAgent,
      details: { role: user.role }
    });
    console.log('📝 Audit Log:', auditLog);

    console.log('🎉 Login API - Login completed successfully');

    // Prepare user data for response (excluding sensitive fields)
    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      profile: {
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        avatar: user.profile.avatar,
        academic: user.profile.academic,
        professional: user.profile.professional
      },
      preferences: user.preferences,
      emailVerified: user.emailVerified,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    };

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: userData,
      token,
      sessionInfo: {
        loginTime: new Date().toISOString(),
        ipAddress: ipAddress !== 'unknown' ? ipAddress : undefined,
        expiresIn: '30 days'
      }
    });

  } catch (error) {
    console.error('💥 Login API - Error:', error);
    
    // Log failed login due to server error
    try {
      const { ipAddress, userAgent } = getClientInfo(request);
      const body = await request.json().catch(() => ({}));
      const auditLog = createAuditLog({
        email: body.email || 'unknown',
        action: 'failed_login',
        success: false,
        ipAddress,
        userAgent,
        details: { 
          reason: 'Server error',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
      console.log('📝 Error Audit Log:', auditLog);
    } catch (logError) {
      console.error('Failed to create audit log:', logError);
    }

    return NextResponse.json(
      { 
        error: 'Internal server error during login',
        code: 'INTERNAL_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint for checking authentication status
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { authenticated: false, message: 'No token provided' },
        { status: 401 }
      );
    }

    // Note: You would implement token verification here
    // For now, just return basic status
    return NextResponse.json({
      authenticated: true,
      message: 'Token verification endpoint - implement as needed'
    });

  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { authenticated: false, error: 'Authentication check failed' },
      { status: 500 }
    );
  }
} 