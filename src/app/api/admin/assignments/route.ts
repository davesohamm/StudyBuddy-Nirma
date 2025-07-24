import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '../../../../lib/mongodb';
import Assignment from '../../../../models/Assignment';
import { User } from '../../../../models/User';
import { authenticateRequest } from '../../../../lib/auth';
import { brevoEmailService } from '../../../../lib/brevo-email';

// POST /api/admin/assignments - Create a new assignment
export async function POST(request: NextRequest) {
  try {
    console.log('🔥 Admin Assignment Creation API Hit');
    await connectDB();

    // Authenticate and authorize admin
    const authResult = authenticateRequest(request);
    console.log('🔐 Auth Result:', {
      success: authResult.success,
      hasUser: !!authResult.user,
      userRole: authResult.user?.role,
      message: authResult.message
    });
    
    if (!authResult.success || !authResult.user) {
      console.log('❌ Authentication failed');
      return NextResponse.json({
        success: false,
        message: authResult.message || 'Authentication required'
      }, { status: 401 });
    }

    if (authResult.user.role !== 'admin') {
      console.log('❌ Not admin role:', authResult.user.role);
      return NextResponse.json({
        success: false,
        message: 'Admin access required'
      }, { status: 403 });
    }

    const body = await request.json();
    console.log('📦 Request Body:', body);
    
    const {
      title,
      subject,
      faculty,
      dueDate,
      marks,
      instructions,
      priority = 'medium',
      tags = [],
      estimatedHours,
      submissionType = 'individual',
      groupSize,
      allowLateSubmission = false,
      latePenalty,
      sendEmailNotification = true
    } = body;

    // Validate required fields
    if (!title || !subject || !faculty || !dueDate || !marks || !instructions) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: title, subject, faculty, dueDate, marks, instructions'
      }, { status: 400 });
    }

    // Validate due date is in the future
    const dueDateObj = new Date(dueDate);
    if (dueDateObj <= new Date()) {
      return NextResponse.json({
        success: false,
        message: 'Due date must be in the future'
      }, { status: 400 });
    }

    // Validate group size for group assignments
    if (submissionType === 'group' && (!groupSize || groupSize < 2)) {
      return NextResponse.json({
        success: false,
        message: 'Group size must be at least 2 for group assignments'
      }, { status: 400 });
    }

    // Validate late penalty if late submission is allowed
    if (allowLateSubmission && (latePenalty === undefined || latePenalty < 0 || latePenalty > 100)) {
      return NextResponse.json({
        success: false,
        message: 'Late penalty must be between 0 and 100 when late submission is allowed'
      }, { status: 400 });
    }

    // Create the assignment
    console.log('👤 User Info for createdBy:', {
      userId: authResult.user.userId,
      userIdType: typeof authResult.user.userId,
      fullUser: authResult.user
    });

    // Ensure we have a valid createdBy value - using ObjectId
    const createdByValue = authResult.user.userId ? 
      new mongoose.Types.ObjectId(authResult.user.userId) : 
      new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');
    console.log('📝 Using createdBy value:', createdByValue);

    const assignment = new Assignment({
      title: title.trim(),
      subject: subject.trim(),
      faculty: faculty.trim(),
      dueDate: dueDateObj,
      marks: parseInt(marks),
      instructions: instructions.trim(),
      priority,
      tags: tags.map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0),
      estimatedHours: estimatedHours ? parseFloat(estimatedHours) : undefined,
      submissionType,
      groupSize: submissionType === 'group' ? parseInt(groupSize) : undefined,
      allowLateSubmission,
      latePenalty: allowLateSubmission ? parseFloat(latePenalty) : undefined,
      createdBy: createdByValue
    });

    await assignment.save();

    console.log('✅ Assignment created successfully:', {
      id: assignment._id,
      title: assignment.title,
      createdBy: assignment.createdBy,
      email: authResult.user.email
    });

    // Send email notifications if requested
    let emailResult = null;
    if (sendEmailNotification) {
      try {
        // Get ALL registered users (except admins) - NO VERIFICATION CHECK
        console.log('🔍 Looking for ALL registered users in database...');
        const allUsers = await User.find({ 
          role: { $ne: 'admin' }
        }).select('email name role').lean();

        console.log('👥 ALL registered users found:', allUsers);
        const allEmails = allUsers.map(user => user.email).filter(email => email);
        console.log('📧 ALL email addresses to notify:', allEmails);

        if (allEmails.length > 0) {
          console.log('📨 Automatically sending emails via Brevo to', allEmails.length, 'registered users');
          emailResult = await brevoEmailService.sendAssignmentNotification(assignment, allEmails);
          console.log('📨 Brevo email service result:', emailResult);
          
          if (emailResult.success) {
            assignment.emailSent = true;
            assignment.emailSentAt = new Date();
            assignment.studentsNotified = Array.from(new Set([...assignment.studentsNotified, ...allEmails]));
            await assignment.save();
            console.log('✅ Assignment notifications sent successfully to', allEmails.length, 'registered users');
          } else {
            console.error('❌ Email notifications failed:', {
              failedEmails: emailResult.failedEmails,
              results: emailResult.results
            });
          }
        } else {
          console.log('⚠️ No registered users found to send emails to');
          emailResult = {
            success: false,
            results: [],
            failedEmails: [],
            error: 'No registered users found in database'
          };
        }
      } catch (emailError) {
        console.error('📧 Email notification error:', emailError);
        // Don't fail the assignment creation if email fails
        emailResult = { 
          success: false, 
          error: emailError instanceof Error ? emailError.message : 'Email service error' 
        };
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Assignment created successfully',
      data: {
        assignment: {
          id: assignment._id,
          title: assignment.title,
          subject: assignment.subject,
          faculty: assignment.faculty,
          dueDate: assignment.dueDate,
          marks: assignment.marks,
          priority: assignment.priority,
          submissionType: assignment.submissionType,
          status: assignment.status,
          createdAt: assignment.createdAt
        },
        emailNotification: emailResult ? {
          sent: emailResult.success,
          totalRecipients: emailResult.results?.length || 0,
          failedEmails: emailResult.failedEmails?.length || 0,
          error: 'error' in emailResult ? emailResult.error : undefined
        } : null
      }
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Assignment creation failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to create assignment',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

// GET /api/admin/assignments - Get all assignments with filtering
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Authenticate and authorize admin
    const authResult = authenticateRequest(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({
        success: false,
        message: 'Authentication required'
      }, { status: 401 });
    }

    if (authResult.user.role !== 'admin') {
      return NextResponse.json({
        success: false,
        message: 'Admin access required'
      }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const subject = searchParams.get('subject');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query
    const query: any = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (subject) query.subject = new RegExp(subject, 'i');

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get assignments with pagination
    const [assignments, totalCount] = await Promise.all([
      Assignment.find(query)
        .populate('createdBy', 'email profile.firstName profile.lastName')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Assignment.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: {
        assignments: assignments.map(assignment => ({
          id: assignment._id,
          title: assignment.title,
          subject: assignment.subject,
          faculty: assignment.faculty,
          dueDate: assignment.dueDate,
          marks: assignment.marks,
          priority: assignment.priority,
          status: assignment.status,
          submissionType: assignment.submissionType,
          groupSize: assignment.groupSize,
          allowLateSubmission: assignment.allowLateSubmission,
          emailSent: assignment.emailSent,
          emailSentAt: assignment.emailSentAt,
          studentsNotified: assignment.studentsNotified?.length || 0,
          reminderSent: assignment.reminderSent,
          tags: assignment.tags,
          createdBy: assignment.createdBy,
          createdAt: assignment.createdAt,
          updatedAt: assignment.updatedAt
        })),
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Failed to fetch assignments:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch assignments',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 