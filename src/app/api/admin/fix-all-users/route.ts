import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import { User } from '../../../../models/User';
import { authenticateRequest } from '../../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Fixing all users to be verified students...');
    
    // Authenticate admin
    const authResult = authenticateRequest(request);
    if (!authResult.success || authResult.user?.role !== 'admin') {
      return NextResponse.json({
        success: false,
        message: 'Admin access required'
      }, { status: 401 });
    }

    await connectDB();

    // Find all users that are not admin
    const allUsers = await User.find({ 
      role: { $ne: 'admin' } 
    }).select('email role emailVerified name');

    console.log('👥 Found users to fix:', allUsers);

    if (allUsers.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No non-admin users found to fix'
      });
    }

    // Update all non-admin users to be verified students
    const updateResult = await User.updateMany(
      { 
        role: { $ne: 'admin' } 
      },
      {
        $set: {
          role: 'student',
          emailVerified: true,
          isActive: true,
          isVerified: true
        }
      }
    );

    console.log('✅ Users updated:', updateResult);

    // Get updated users
    const updatedUsers = await User.find({ 
      role: 'student',
      emailVerified: true 
    }).select('email role emailVerified name');

    console.log('🎓 Verified students now:', updatedUsers);

    return NextResponse.json({
      success: true,
      message: `Fixed ${updateResult.modifiedCount} users to be verified students`,
      data: {
        usersFound: allUsers.length,
        usersModified: updateResult.modifiedCount,
        verifiedStudents: updatedUsers
      }
    });

  } catch (error) {
    console.error('❌ Failed to fix users:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fix users',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 