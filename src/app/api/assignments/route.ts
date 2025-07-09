import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { authenticateRequest } from '@/lib/auth-real';
import { Assignment } from '@/models/Assignment';

// GET /api/assignments - Get all assignments
export async function GET(request: NextRequest) {
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
    
    // All authenticated users can see all assignments
    const assignments = await Assignment.find({}).populate('course', 'title courseCode');
    
    return NextResponse.json({ assignments });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assignments' },
      { status: 500 }
    );
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
    
    await dbConnect();
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