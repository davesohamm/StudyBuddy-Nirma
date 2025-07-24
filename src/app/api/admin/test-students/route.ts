import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import { User } from '../../../../models/User';
import { authenticateRequest } from '../../../../lib/auth';

// Force dynamic route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing student retrieval...');
    
    // Authenticate admin
    const authResult = authenticateRequest(request);
    if (!authResult.success || authResult.user?.role !== 'admin') {
      return NextResponse.json({
        success: false,
        message: 'Admin access required'
      }, { status: 401 });
    }

    await connectDB();
    console.log('✅ Database connected');

    // Get all users
    const allUsers = await User.find({}).select('email role emailVerified').lean();
    console.log('👥 All users found:', allUsers);

    // Get students specifically
    const students = await User.find({ 
      role: 'student',
      emailVerified: true 
    }).select('email').lean();
    
    console.log('🎓 Students found:', students);

    const studentEmails = students.map(student => student.email);
    console.log('📧 Student emails:', studentEmails);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers: allUsers.length,
        allUsers: allUsers,
        totalStudents: students.length,
        students: students,
        studentEmails: studentEmails
      }
    });

  } catch (error) {
    console.error('❌ Test failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 