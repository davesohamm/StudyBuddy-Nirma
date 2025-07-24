import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Assignment from '../../../models/Assignment';
import { authenticateRequest } from '../../../lib/auth';

// Force dynamic route
export const dynamic = 'force-dynamic';

// GET /api/assignments - Get all assignments for students
export async function GET(request: NextRequest) {
  try {
    console.log('📚 Student Assignments API Hit');
    
    // Authenticate user (any logged in user can see assignments)
    const authResult = authenticateRequest(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({
        success: false,
        message: 'Authentication required'
      }, { status: 401 });
    }

    console.log('👤 User requesting assignments:', {
      userId: authResult.user.userId,
      email: authResult.user.email,
      role: authResult.user.role
    });

    await connectDB();
    
    // Get all active assignments, sorted by due date
    const assignments = await Assignment.find({ 
      status: 'active' 
    })
    .populate('createdBy', 'email profile.firstName profile.lastName name')
    .sort({ dueDate: 1 }) // Sort by due date (nearest first)
    .lean();

    console.log(`📋 Found ${assignments.length} active assignments`);

    // Format assignments for student view
    const formattedAssignments = assignments.map(assignment => ({
      id: assignment._id,
      title: assignment.title,
      subject: assignment.subject,
      faculty: assignment.faculty,
      dueDate: assignment.dueDate,
      marks: assignment.marks,
      instructions: assignment.instructions,
      priority: assignment.priority,
      status: assignment.status,
      tags: assignment.tags || [],
      estimatedHours: assignment.estimatedHours,
      submissionType: assignment.submissionType,
      groupSize: assignment.groupSize,
      allowLateSubmission: assignment.allowLateSubmission,
      latePenalty: assignment.latePenalty,
      createdAt: assignment.createdAt,
      createdBy: {
        name: (assignment.createdBy as any)?.name || (assignment.createdBy as any)?.profile?.firstName || 'Admin',
        email: (assignment.createdBy as any)?.email || 'admin@studybuddy.com'
      },
      // Calculate days remaining
      daysRemaining: Math.ceil((new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      // Calculate if overdue
      isOverdue: new Date(assignment.dueDate) < new Date(),
      // Format due date
      formattedDueDate: new Date(assignment.dueDate).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }));

    // Separate assignments by status
    const upcomingAssignments = formattedAssignments.filter(a => !a.isOverdue);
    const overdueAssignments = formattedAssignments.filter(a => a.isOverdue);

    console.log(`📊 Assignment stats: ${upcomingAssignments.length} upcoming, ${overdueAssignments.length} overdue`);
    
    return NextResponse.json({
      success: true,
      message: `Found ${assignments.length} assignments`,
      data: {
        assignments: formattedAssignments,
        upcomingAssignments,
        overdueAssignments,
        totalCount: assignments.length,
        upcomingCount: upcomingAssignments.length,
        overdueCount: overdueAssignments.length,
        stats: {
          highPriority: formattedAssignments.filter(a => a.priority === 'high').length,
          mediumPriority: formattedAssignments.filter(a => a.priority === 'medium').length,
          lowPriority: formattedAssignments.filter(a => a.priority === 'low').length,
          totalMarks: formattedAssignments.reduce((sum, a) => sum + a.marks, 0)
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

// POST /api/assignments - Create new assignment (authenticated users)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const authResult = authenticateRequest(authHeader);
    
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const assignmentData = await request.json();
    
    await connectDB();
    const assignment = new Assignment({
      ...assignmentData,
      createdBy: authResult.user.userId
    });
    
    await assignment.save();
    await assignment.populate('course', 'title courseCode');
    
    return NextResponse.json({ assignment }, { status: 201 });
  } catch (error) {
    console.error('Error creating assignment:', error);
    return NextResponse.json(
      { error: 'Failed to create assignment' },
      { status: 500 }
    );
  }
} 