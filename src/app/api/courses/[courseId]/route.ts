import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { authenticateRequest } from '@/lib/auth-real';
import { Course } from '@/models/Course';

// GET /api/courses/[courseId] - Get course details (public)
export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    await dbConnect();
    const course = await Course.findById(params.courseId).populate('instructor', 'name email');
    
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ course });
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}

// PUT /api/courses/[courseId] - Update course (authenticated users)
export async function PUT(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const authResult = authenticateRequest(authHeader);
    
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const courseData = await request.json();
    
    await dbConnect();
    const course = await Course.findByIdAndUpdate(
      params.courseId,
      courseData,
      { new: true, runValidators: true }
    ).populate('instructor', 'name email');
    
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ course });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[courseId] - Delete course (authenticated users)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const authResult = authenticateRequest(authHeader);
    
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    const course = await Course.findByIdAndDelete(params.courseId);
    
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  }
} 