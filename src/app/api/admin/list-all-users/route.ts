import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import { User } from '../../../../models/User';
import { authenticateRequest } from '../../../../lib/auth';

// Force dynamic route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Fetching ALL users from database...');
    
    // Authenticate admin
    const authResult = authenticateRequest(request);
    if (!authResult.success || authResult.user?.role !== 'admin') {
      return NextResponse.json({
        success: false,
        message: 'Admin access required'
      }, { status: 401 });
    }

    await connectDB();

    // Get ALL users
    const allUsers = await User.find({}).select('name email role emailVerified isActive isVerified createdAt profile.firstName profile.lastName');

    console.log('👥 ALL USERS IN DATABASE:');
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} | Role: ${user.role} | EmailVerified: ${user.emailVerified} | Active: ${user.isActive} | Name: ${user.name}`);
    });

    // Separate by categories
    const adminUsers = allUsers.filter(u => u.role === 'admin');
    const studentUsers = allUsers.filter(u => u.role === 'student');
    const otherUsers = allUsers.filter(u => u.role !== 'admin' && u.role !== 'student');
    const verifiedEmails = allUsers.filter(u => u.emailVerified === true);
    const allEmails = allUsers.map(u => u.email);

    console.log('📊 USER STATISTICS:');
    console.log(`Total Users: ${allUsers.length}`);
    console.log(`Admins: ${adminUsers.length}`);
    console.log(`Students: ${studentUsers.length}`);
    console.log(`Others: ${otherUsers.length}`);
    console.log(`Email Verified: ${verifiedEmails.length}`);
    console.log(`All Emails: ${allEmails.join(', ')}`);

    return NextResponse.json({
      success: true,
      message: `Found ${allUsers.length} total users`,
      data: {
        totalUsers: allUsers.length,
        allUsers: allUsers.map(u => ({
          id: u._id,
          email: u.email,
          name: u.name,
          role: u.role,
          emailVerified: u.emailVerified,
          isActive: u.isActive,
          isVerified: u.isVerified,
          createdAt: u.createdAt,
          firstName: u.profile?.firstName,
          lastName: u.profile?.lastName
        })),
        statistics: {
          admins: adminUsers.length,
          students: studentUsers.length,
          others: otherUsers.length,
          emailVerified: verifiedEmails.length,
          allEmails: allEmails
        },
        adminEmails: adminUsers.map(u => u.email),
        studentEmails: studentUsers.map(u => u.email),
        verifiedEmails: verifiedEmails.map(u => u.email),
        allEmails: allEmails
      }
    });

  } catch (error) {
    console.error('❌ Failed to fetch users:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch users',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 