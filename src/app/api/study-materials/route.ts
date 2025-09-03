import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { StudyMaterial } from '@/models/StudyMaterial';
import { authenticateRequest } from '@/lib/auth';
import { User } from '@/models/User'; // Import User model to populate createdBy
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

// GET /api/study-materials?courseId=...
export async function GET(request: NextRequest) {
  try {
    const authResult = authenticateRequest(request);
    if (!authResult.success) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json({ success: false, message: 'Course ID is required' }, { status: 400 });
    }

    await connectDB();

    const materials = await StudyMaterial.find({ courseId })
      .populate<{ uploadedBy: { _id: string; name: string; email: string, role: 'student' | 'faculty' | 'admin' } }>({
        path: 'uploadedBy',
        model: User,
        select: 'name email role'
      })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: materials }, { status: 200 });

  } catch (error) {
    console.error('Failed to fetch study materials:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, message: 'Failed to fetch study materials', error: errorMessage }, { status: 500 });
  }
}

// POST /api/study-materials
export async function POST(request: NextRequest) {
  try {
    const authResult = authenticateRequest(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    const { userId } = authResult.user;
    const body = await request.json();
    const { url, title, courseId } = body;

    if (!url || !courseId) {
      return NextResponse.json({ success: false, message: 'URL and Course ID are required' }, { status: 400 });
    }
    
    // Quick URL validation
    try {
      new URL(url);
    } catch (_) {
      return NextResponse.json({ success: false, message: 'Invalid URL format' }, { status: 400 });
    }

    await connectDB();

    const newMaterial = new StudyMaterial({
      url,
      title,
      courseId,
      uploadedBy: new mongoose.Types.ObjectId(userId),
    });

    await newMaterial.save();
    
    const populatedMaterial = await StudyMaterial.findById(newMaterial._id)
      .populate<{ uploadedBy: { _id: string; name: string; email: string, role: 'student' | 'faculty' | 'admin' } }>({
        path: 'uploadedBy',
        model: User,
        select: 'name email role'
      })
      .lean();


    return NextResponse.json({ success: true, data: populatedMaterial }, { status: 201 });

  } catch (error) {
    console.error('Failed to create study material:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, message: 'Failed to create study material', error: errorMessage }, { status: 500 });
  }
} 