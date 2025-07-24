import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '../../../../lib/auth';
import { brevoEmailService } from '../../../../lib/brevo-email';

export async function POST(request: NextRequest) {
  try {
    console.log('📧 Test Email API Hit');
    
    // Authenticate admin
    const authResult = authenticateRequest(request);
    if (!authResult.success || authResult.user?.role !== 'admin') {
      return NextResponse.json({
        success: false,
        message: 'Admin access required'
      }, { status: 401 });
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email address is required'
      }, { status: 400 });
    }

    console.log('📨 Sending test email via Brevo to:', email);

    const result = await brevoEmailService.sendTestEmail(email);

    console.log('📧 Brevo test email result:', result);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Test email sent successfully to ${email}`,
        data: {
          messageId: result.messageId,
          email: email,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to send test email',
        error: result.error,
        data: {
          email: email,
          timestamp: new Date().toISOString()
        }
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Test email API failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Test email API failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 