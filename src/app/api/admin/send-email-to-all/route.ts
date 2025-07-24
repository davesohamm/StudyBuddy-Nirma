import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import { User } from '../../../../models/User';
import Assignment from '../../../../models/Assignment';
import { authenticateRequest } from '../../../../lib/auth';
import { brevoEmailService } from '../../../../lib/brevo-email';

export async function POST(request: NextRequest) {
  try {
    console.log('📧 Sending emails to ALL users...');
    
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
    const { assignmentId, includeAdmins = false } = body;

    if (!assignmentId) {
      return NextResponse.json({
        success: false,
        message: 'Assignment ID is required'
      }, { status: 400 });
    }

    // Get the assignment
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return NextResponse.json({
        success: false,
        message: 'Assignment not found'
      }, { status: 404 });
    }

    console.log('📝 Assignment to notify about:', {
      id: assignment._id,
      title: assignment.title,
      subject: assignment.subject
    });

    // Get ALL users (exclude admin unless specifically requested)
    let userQuery = {};
    if (!includeAdmins) {
      userQuery = { role: { $ne: 'admin' } };
    }

    const allUsers = await User.find(userQuery).select('name email role emailVerified isActive');

    console.log('👥 ALL USERS TO EMAIL:');
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} | Role: ${user.role} | Verified: ${user.emailVerified}`);
    });

    if (allUsers.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No users found to send emails to'
      });
    }

    // Get all email addresses
    const allEmails = allUsers.map(user => user.email).filter(email => email);

    console.log(`📨 Sending assignment notification to ${allEmails.length} users:`, allEmails);

    // Send emails using Brevo email service
    const emailResult = await brevoEmailService.sendAssignmentNotification(
      assignment,
      allEmails
    );

    console.log('📨 Email service result:', emailResult);

    // Update assignment to mark emails as sent
    await Assignment.findByIdAndUpdate(assignmentId, {
      emailSent: true,
      emailSentAt: new Date(),
      studentsNotified: allEmails
    });

    if (emailResult.success) {
      console.log(`✅ Assignment notifications sent successfully to ${allEmails.length} users`);
      
      return NextResponse.json({
        success: true,
        message: `Assignment notifications sent to ${allEmails.length} users`,
        data: {
          assignment: {
            id: assignment._id,
            title: assignment.title,
            subject: assignment.subject
          },
          emailsSent: allEmails.length,
          emailAddresses: allEmails,
          emailResult: emailResult,
          failedEmails: emailResult.failedEmails
        }
      });
    } else {
      console.error('❌ Email notifications failed. Failed emails:', emailResult.failedEmails);
      
      return NextResponse.json({
        success: false,
        message: 'Failed to send assignment notifications',
        failedEmails: emailResult.failedEmails,
        data: {
          assignment: {
            id: assignment._id,
            title: assignment.title
          },
          intendedRecipients: allEmails.length,
          emailAddresses: allEmails,
          emailResult: emailResult
        }
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Failed to send emails to all users:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to send emails to all users',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 