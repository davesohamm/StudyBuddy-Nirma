import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import Assignment from '../../../../../models/Assignment';
import { User } from '../../../../../models/User';
import { authenticateRequest } from '../../../../../lib/auth';
import { brevoEmailService } from '../../../../../lib/brevo-email';

// GET /api/admin/assignments/[id] - Get a specific assignment
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const assignment = await Assignment.findById(params.id)
      .populate('createdBy', 'email profile.firstName profile.lastName')
      .lean();

    if (!assignment) {
      return NextResponse.json({
        success: false,
        message: 'Assignment not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        assignment: {
          id: assignment._id,
          title: assignment.title,
          subject: assignment.subject,
          faculty: assignment.faculty,
          dueDate: assignment.dueDate,
          marks: assignment.marks,
          instructions: assignment.instructions,
          priority: assignment.priority,
          status: assignment.status,
          tags: assignment.tags,
          estimatedHours: assignment.estimatedHours,
          submissionType: assignment.submissionType,
          groupSize: assignment.groupSize,
          allowLateSubmission: assignment.allowLateSubmission,
          latePenalty: assignment.latePenalty,
          emailSent: assignment.emailSent,
          emailSentAt: assignment.emailSentAt,
          studentsNotified: assignment.studentsNotified?.length || 0,
          reminderSent: assignment.reminderSent,
          reminderSentAt: assignment.reminderSentAt,
          createdBy: assignment.createdBy,
          createdAt: assignment.createdAt,
          updatedAt: assignment.updatedAt
        }
      }
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Failed to fetch assignment:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch assignment',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT /api/admin/assignments/[id] - Update an assignment
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const assignment = await Assignment.findById(params.id);
    if (!assignment) {
      return NextResponse.json({
        success: false,
        message: 'Assignment not found'
      }, { status: 404 });
    }

    const body = await request.json();
    const {
      title,
      subject,
      faculty,
      dueDate,
      marks,
      instructions,
      priority,
      status,
      tags,
      estimatedHours,
      submissionType,
      groupSize,
      allowLateSubmission,
      latePenalty,
      sendNotificationOnUpdate = false
    } = body;

    // Store original due date for notification logic
    const originalDueDate = assignment.dueDate;

    // Update assignment fields if provided
    if (title !== undefined) assignment.title = title.trim();
    if (subject !== undefined) assignment.subject = subject.trim();
    if (faculty !== undefined) assignment.faculty = faculty.trim();
    if (dueDate !== undefined) {
      const dueDateObj = new Date(dueDate);
      if (dueDateObj <= new Date()) {
        return NextResponse.json({
          success: false,
          message: 'Due date must be in the future'
        }, { status: 400 });
      }
      assignment.dueDate = dueDateObj;
    }
    if (marks !== undefined) assignment.marks = parseInt(marks);
    if (instructions !== undefined) assignment.instructions = instructions.trim();
    if (priority !== undefined) assignment.priority = priority;
    if (status !== undefined) assignment.status = status;
    if (tags !== undefined) assignment.tags = tags.map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0);
    if (estimatedHours !== undefined) assignment.estimatedHours = estimatedHours ? parseFloat(estimatedHours) : undefined;
    if (submissionType !== undefined) {
      assignment.submissionType = submissionType;
      if (submissionType === 'group' && groupSize && groupSize >= 2) {
        assignment.groupSize = parseInt(groupSize);
      } else if (submissionType === 'individual') {
        assignment.groupSize = undefined;
      }
    }
    if (allowLateSubmission !== undefined) {
      assignment.allowLateSubmission = allowLateSubmission;
      if (allowLateSubmission && latePenalty !== undefined) {
        assignment.latePenalty = parseFloat(latePenalty);
      } else if (!allowLateSubmission) {
        assignment.latePenalty = undefined;
      }
    }

    await assignment.save();

    console.log('✅ Assignment updated:', {
      id: assignment._id,
      title: assignment.title,
      updatedBy: authResult.user.email
    });

    // Send notification if due date changed and notification is requested
    let emailResult = null;
    if (sendNotificationOnUpdate && dueDate && new Date(dueDate).getTime() !== originalDueDate.getTime()) {
      try {
        const allUsers = await User.find({ 
          role: { $ne: 'admin' }
        }).select('email name role').lean();

        const allEmails = allUsers.map(user => user.email).filter(email => email);

        if (allEmails.length > 0) {
          emailResult = await brevoEmailService.sendAssignmentNotification(assignment, allEmails);
          
          if (emailResult.success) {
            assignment.emailSent = true;
            assignment.emailSentAt = new Date();
            assignment.studentsNotified = Array.from(new Set([...assignment.studentsNotified, ...allEmails]));
            await assignment.save();
            console.log('📧 Assignment update notifications sent successfully to', allEmails.length, 'registered users');
          }
        }
      } catch (emailError) {
        console.error('📧 Email notification error:', emailError);
        emailResult = { 
          success: false, 
          error: emailError instanceof Error ? emailError.message : 'Email service error' 
        };
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Assignment updated successfully',
      data: {
        assignment: {
          id: assignment._id,
          title: assignment.title,
          subject: assignment.subject,
          faculty: assignment.faculty,
          dueDate: assignment.dueDate,
          marks: assignment.marks,
          priority: assignment.priority,
          status: assignment.status,
          submissionType: assignment.submissionType,
          updatedAt: assignment.updatedAt
        },
        emailNotification: emailResult ? {
          sent: emailResult.success,
          error: 'error' in emailResult ? emailResult.error : undefined
        } : null
      }
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Assignment update failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to update assignment',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE /api/admin/assignments/[id] - Delete an assignment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const assignment = await Assignment.findById(params.id);
    if (!assignment) {
      return NextResponse.json({
        success: false,
        message: 'Assignment not found'
      }, { status: 404 });
    }

    // Store assignment info for logging
    const assignmentInfo = {
      id: assignment._id,
      title: assignment.title,
      subject: assignment.subject
    };

    await Assignment.findByIdAndDelete(params.id);

    console.log('🗑️ Assignment deleted:', {
      ...assignmentInfo,
      deletedBy: authResult.user.email
    });

    return NextResponse.json({
      success: true,
      message: 'Assignment deleted successfully',
      data: {
        deletedAssignment: assignmentInfo
      }
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Assignment deletion failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to delete assignment',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 