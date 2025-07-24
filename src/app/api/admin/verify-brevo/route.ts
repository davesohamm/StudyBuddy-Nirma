import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '../../../../lib/auth';
import { config } from '../../../../lib/config';

// Force dynamic route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Verifying Brevo account status...');
    
    // Authenticate admin
    const authResult = authenticateRequest(request);
    if (!authResult.success || authResult.user?.role !== 'admin') {
      return NextResponse.json({
        success: false,
        message: 'Admin access required'
      }, { status: 401 });
    }

    // Check Brevo account info
    const response = await fetch('https://api.brevo.com/v3/account', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'api-key': config.email.brevo.apiKey
      }
    });

    const accountData = await response.json();

    console.log('📋 Brevo Account Info:', {
      status: response.status,
      success: response.ok,
      data: accountData
    });

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Brevo account verified successfully',
        data: {
          account: accountData,
          apiKeyStatus: 'Valid',
          emailLimits: accountData.plan || 'Unknown',
          senderEmail: config.email.brevo.fromEmail
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Brevo account verification failed',
        error: accountData.message || 'API key might be invalid',
        data: {
          status: response.status,
          apiKeyUsed: config.email.brevo.apiKey ? config.email.brevo.apiKey.substring(0, 15) + '...' : 'NOT SET'
        }
      }, { status: response.status });
    }

  } catch (error) {
    console.error('❌ Brevo verification failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to verify Brevo account',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 