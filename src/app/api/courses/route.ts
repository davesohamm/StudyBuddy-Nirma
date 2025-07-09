import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { authenticateRequest } from '@/lib/auth-real';
import { Course } from '@/models/Course';

// GET /api/courses - Get all courses (public)
export async function GET() {
  try {
    await dbConnect();
    const courses = await Course.find({}).populate('instructor', 'name email');
    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

// POST /api/courses - Create new course (authenticated users)
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

    const courseData = await request.json();
    
    await dbConnect();
    const course = new Course({
      ...courseData,
      instructor: authResult.user.userId
    });
    
    await course.save();
    await course.populate('instructor', 'name email');
    
    return NextResponse.json({ course }, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
} 