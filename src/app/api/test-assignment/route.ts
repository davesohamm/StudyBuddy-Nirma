import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Assignment from '../../../models/Assignment';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing assignment creation...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Database connected');

    // Test assignment data
    const testAssignment = new Assignment({
      title: 'Test Assignment',
      subject: 'Test Subject',
      faculty: 'Test Faculty',
      dueDate: new Date('2024-12-31T23:59:00Z'),
      marks: 10,
      instructions: 'This is a test assignment',
      priority: 'medium',
      submissionType: 'individual',
      allowLateSubmission: false,
      createdBy: '507f1f77bcf86cd799439011' // Dummy ObjectId
    });

    console.log('💾 Saving test assignment...');
    const savedAssignment = await testAssignment.save();
    console.log('✅ Assignment saved:', savedAssignment._id);

    return NextResponse.json({
      success: true,
      message: 'Test assignment created successfully',
      assignmentId: savedAssignment._id
    });

  } catch (error) {
    console.error('❌ Test assignment creation failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 