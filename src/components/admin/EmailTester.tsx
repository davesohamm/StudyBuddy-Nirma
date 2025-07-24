'use client';

import { useState } from 'react';

export default function EmailTester() {
  const [email, setEmail] = useState('');
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; messageId?: string } | null>(null);

  const testEmail = async () => {
    if (!email) {
      alert('Please enter an email address');
      return;
    }

    try {
      setTesting(true);
      setResult(null);

      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      setResult({
        success: data.success,
        message: data.message,
        messageId: data.data?.messageId
      });

      if (data.success) {
        console.log('✅ Test email sent:', data);
      } else {
        console.error('❌ Test email failed:', data);
      }
    } catch (error) {
      console.error('❌ Email test error:', error);
      setResult({
        success: false,
        message: 'Network error during email test'
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📧 Brevo Email Configuration Test</h2>
      
      <div className="space-y-4">
        {/* Brevo Account Verification */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">🔍 First, verify your Brevo account:</h3>
          <button
            onClick={async () => {
              try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/admin/verify-brevo', {
                  headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                
                if (data.success) {
                  alert(`✅ Brevo Account Verified!\n\nPlan: ${data.data.emailLimits?.type || 'Unknown'}\nSender: ${data.data.senderEmail}`);
                } else {
                  alert(`❌ Brevo Account Issue:\n${data.message}\n\nCheck your API key!`);
                }
              } catch (error) {
                alert('❌ Failed to verify Brevo account');
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            🔍 Verify Brevo Account
          </button>
        </div>

        <div>
          <label htmlFor="test-email" className="block text-sm font-medium text-gray-700 mb-2">
            Test Email Address
          </label>
          <input
            id="test-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email to test..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-600 mt-1">
            💡 <strong>Tip:</strong> Try sending to <code>davesohamm1@outlook.com</code> first (your Brevo account email)
          </p>
        </div>
        
        <button
          onClick={testEmail}
          disabled={testing || !email}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {testing ? '⏳ Sending Test Email...' : '🧪 Send Test Email'}
        </button>
        
        {result && (
          <div className={`p-4 rounded-lg border ${
            result.success 
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-start">
              <span className="mr-2">
                {result.success ? '✅' : '❌'}
              </span>
              <div className="flex-1">
                <p className="font-medium">{result.message}</p>
                {result.messageId && (
                  <p className="text-sm mt-1 opacity-75">
                    Message ID: {result.messageId}
                  </p>
                )}
                {result.success && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-yellow-800 text-sm font-medium mb-2">
                      📧 Email sent successfully! If you don't see it:
                    </p>
                    <ul className="text-yellow-700 text-sm space-y-1">
                      <li>• Check your <strong>Spam/Junk folder</strong></li>
                      <li>• Wait 2-3 minutes for delivery</li>
                      <li>• Try sending to your own email first</li>
                      <li>• Check if email provider blocks unknown senders</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">📋 Current Email Configuration:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Sender: <code>davesohamm1@outlook.com</code> (Your Brevo account email)</li>
            <li>• Service: Brevo REST API (Direct)</li>
            <li>• Domain: Using Outlook (reliable)</li>
            <li>• Rate limit: 5 emails per batch</li>
            <li>• Recipients: Can send to ANY email address</li>
          </ul>
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-green-800 text-sm font-medium">
              🎉 Advantage: Using your Brevo account email as sender ensures proper authentication!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 