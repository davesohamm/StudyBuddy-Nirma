import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import { User } from '../../../../../models/User';
import { authenticateRequest } from '../../../../../lib/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    console.log('🗑️ Admin Delete User API Hit');
    
    // Authenticate admin
    const authResult = authenticateRequest(request);
    console.log('🔐 Auth Result:', authResult);
    
    if (!authResult.success || authResult.user?.role !== 'admin') {
      return NextResponse.json({
        success: false,
        message: 'Admin access required'
      }, { status: 401 });
    }

    await connectDB();

    const { userId } = params;
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'User ID is required'
      }, { status: 400 });
    }

    console.log('🎯 Deleting user with ID:', userId);

    // First, find the user to check their role
    const userToDelete = await User.findById(userId);
    
    if (!userToDelete) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }

    // Prevent deletion of admin users
    if (userToDelete.role === 'admin') {
      return NextResponse.json({
        success: false,
        message: 'Cannot delete admin users'
      }, { status: 403 });
    }

    console.log('👤 User to delete:', {
      id: userToDelete._id,
      email: userToDelete.email,
      name: userToDelete.name,
      role: userToDelete.role
    });

    // Delete the user
    await User.findByIdAndDelete(userId);

    console.log('✅ User deleted successfully');

    return NextResponse.json({
      success: true,
      message: `User ${userToDelete.email} deleted successfully`,
      data: {
        deletedUser: {
          id: userToDelete._id,
          email: userToDelete.email,
          name: userToDelete.name,
          role: userToDelete.role
        }
      }
    });

  } catch (error) {
    console.error('❌ Failed to delete user:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to delete user',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 