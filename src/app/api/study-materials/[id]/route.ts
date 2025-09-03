import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { StudyMaterial } from '@/models/StudyMaterial';
import { authenticateRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// DELETE /api/study-materials/[id]
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = authenticateRequest(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    if (authResult.user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Study material ID is required' }, { status: 400 });
    }

    await connectDB();

    const deletedMaterial = await StudyMaterial.findByIdAndDelete(id);

    if (!deletedMaterial) {
      return NextResponse.json({ success: false, message: 'Study material not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Study material deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Failed to delete study material:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, message: 'Failed to delete study material', error: errorMessage }, { status: 500 });
  }
} 