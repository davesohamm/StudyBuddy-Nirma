import { config } from './config';
import { IAssignment } from '../models/Assignment';

export interface EmailTemplate {
  html: string;
  text: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Brevo Email service class using REST API
export class BrevoEmailService {
  private static instance: BrevoEmailService;
  private apiUrl = 'https://api.brevo.com/v3/smtp/email';

  public static getInstance(): BrevoEmailService {
    if (!BrevoEmailService.instance) {
      BrevoEmailService.instance = new BrevoEmailService();
    }
    return BrevoEmailService.instance;
  }

  // Create assignment notification email template
  private createAssignmentEmailTemplate(assignment: IAssignment): EmailTemplate {
    const priorityEmoji = {
      low: '🟢',
      medium: '🟡', 
      high: '🔴'
    };

    const priorityColor = {
      low: '#10B981',
      medium: '#F59E0B',
      high: '#EF4444'
    };

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Assignment: ${assignment.title}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
            .content { padding: 30px 20px; }
            .assignment-card { background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid ${priorityColor[assignment.priority]}; }
            .priority-badge { display: inline-block; background: ${priorityColor[assignment.priority]}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin: 10px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
            .detail-label { font-weight: 600; color: #64748b; }
            .detail-value { color: #334155; }
            .instructions { background: #f1f5f9; padding: 15px; border-radius: 6px; margin: 15px 0; }
            .footer { background: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
            .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 15px 0; }
            @media (max-width: 480px) { .container { margin: 10px; } .content { padding: 20px 15px; } }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📚 New Assignment Notification</h1>
              <p style="margin: 8px 0 0 0; opacity: 0.9;">Nirma StudyBuddy Portal</p>
            </div>
            
            <div class="content">
              <div class="assignment-card">
                <h2 style="margin: 0 0 10px 0; color: #1e293b; font-size: 20px;">${assignment.title}</h2>
                <div class="priority-badge">${priorityEmoji[assignment.priority]} ${assignment.priority.toUpperCase()} Priority</div>
                
                <div class="detail-row">
                  <span class="detail-label">Subject:</span>
                  <span class="detail-value">${assignment.subject}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Faculty:</span>
                  <span class="detail-value">${assignment.faculty}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Due Date:</span>
                  <span class="detail-value" style="font-weight: 600; color: #dc2626;">${new Date(assignment.dueDate).toLocaleDateString('en-IN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Total Marks:</span>
                  <span class="detail-value">${assignment.marks}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Submission Type:</span>
                  <span class="detail-value">${assignment.submissionType === 'group' ? `Group (${assignment.groupSize} members)` : 'Individual'}</span>
                </div>
                
                ${assignment.estimatedHours ? `
                <div class="detail-row">
                  <span class="detail-label">Estimated Hours:</span>
                  <span class="detail-value">${assignment.estimatedHours} hours</span>
                </div>` : ''}
                
                ${assignment.allowLateSubmission ? `
                <div class="detail-row">
                  <span class="detail-label">Late Submission:</span>
                  <span class="detail-value">Allowed (${assignment.latePenalty}% penalty per day)</span>
                </div>` : ''}
              </div>
              
              <div class="instructions">
                <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 16px;">📋 Instructions:</h3>
                <p style="margin: 0; white-space: pre-line;">${assignment.instructions}</p>
              </div>
              
              ${assignment.tags && assignment.tags.length > 0 ? `
              <div style="margin: 20px 0;">
                <strong>Tags:</strong> 
                ${assignment.tags.map(tag => `<span style="background: #e2e8f0; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin: 0 4px;">${tag}</span>`).join('')}
              </div>` : ''}
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${config.app.url}/dashboard" class="cta-button">View in Dashboard</a>
              </div>
              
              <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px; color: #92400e;">
                  <strong>⚠️ Important:</strong> Make sure to submit your assignment before the due date. Late submissions may not be accepted unless specified otherwise.
                </p>
              </div>
            </div>
            
            <div class="footer">
              <p style="margin: 0;">This email was sent from Nirma StudyBuddy Portal</p>
              <p style="margin: 5px 0 0 0; font-size: 12px;">
                If you have any questions, please contact your faculty or the portal administrators.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
📚 NEW ASSIGNMENT NOTIFICATION

Title: ${assignment.title}
Subject: ${assignment.subject}
Faculty: ${assignment.faculty}
Due Date: ${new Date(assignment.dueDate).toLocaleDateString('en-IN')}
Total Marks: ${assignment.marks}
Priority: ${assignment.priority.toUpperCase()}
Submission Type: ${assignment.submissionType === 'group' ? `Group (${assignment.groupSize} members)` : 'Individual'}

Instructions:
${assignment.instructions}

${assignment.estimatedHours ? `Estimated Hours: ${assignment.estimatedHours} hours\n` : ''}
${assignment.allowLateSubmission ? `Late Submission: Allowed (${assignment.latePenalty}% penalty per day)\n` : ''}

View in Dashboard: ${config.app.url}/dashboard

---
Nirma StudyBuddy Portal
This is an automated notification. Please do not reply to this email.
    `;

    return { html, text };
  }

  // Send single email via Brevo REST API
  private async sendSingleEmail(
    to: string,
    subject: string,
    htmlContent: string,
    textContent: string
  ): Promise<EmailResult> {
    try {
      console.log('📤 Sending email via Brevo REST API to:', to);

      const emailData = {
        sender: {
          name: config.email.brevo.fromName,
          email: config.email.brevo.fromEmail
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: htmlContent,
        textContent: textContent,
        replyTo: {
          email: config.email.brevo.replyTo,
          name: config.email.brevo.fromName
        },
        tags: ['assignment-notification']
      };

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': config.email.brevo.apiKey
        },
        body: JSON.stringify(emailData)
      });

      const result = await response.json();

      console.log('📬 Brevo API Response for', to, ':', {
        status: response.status,
        success: response.ok,
        messageId: result.messageId,
        result: result
      });

      if (response.ok) {
        return {
          success: true,
          messageId: result.messageId,
          error: undefined
        };
      } else {
        return {
          success: false,
          messageId: undefined,
          error: `API Error: ${result.message || result.error || 'Unknown error'}`
        };
      }
    } catch (error: any) {
      console.error(`❌ Failed to send email to ${to} via Brevo REST API:`, error);
      return {
        success: false,
        messageId: undefined,
        error: error.message || 'Network error'
      };
    }
  }

  // Send assignment notification to multiple students using Brevo REST API
  public async sendAssignmentNotification(
    assignment: IAssignment, 
    studentEmails: string[]
  ): Promise<{ success: boolean; results: EmailResult[]; failedEmails: string[] }> {
    const template = this.createAssignmentEmailTemplate(assignment);
    const results: EmailResult[] = [];
    const failedEmails: string[] = [];

    console.log('📧 Using Brevo REST API to send emails to:', studentEmails.length, 'recipients');
    console.log('🔑 Brevo API Key:', config.email.brevo.apiKey ? config.email.brevo.apiKey.substring(0, 15) + '...' : 'NOT SET');

    const subject = config.email.templates.assignment.subject.replace('{{title}}', assignment.title);

    // Send emails with rate limiting
    const batchSize = 5; // Conservative batch size for REST API
    const batches = [];
    
    for (let i = 0; i < studentEmails.length; i += batchSize) {
      batches.push(studentEmails.slice(i, i + batchSize));
    }

    for (const batch of batches) {
      const emailPromises = batch.map(email => 
        this.sendSingleEmail(email, subject, template.html, template.text)
      );

      const batchResults = await Promise.allSettled(emailPromises);
      
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
          
          if (!result.value.success) {
            failedEmails.push(batch[index]);
          }
        } else {
          results.push({
            success: false,
            error: result.reason?.message || 'Promise rejected'
          });
          failedEmails.push(batch[index]);
        }
      });

      // Add delay between batches
      if (batches.indexOf(batch) < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
      }
    }

    const successCount = results.filter(r => r.success).length;
    const success = failedEmails.length === 0;

    console.log(`📊 Brevo email summary: ${successCount}/${studentEmails.length} sent successfully`);
    
    return { success, results, failedEmails };
  }

  // Test email functionality with Brevo REST API
  public async sendTestEmail(to: string): Promise<EmailResult> {
    try {
      console.log('🧪 Testing Brevo email configuration via REST API...');
      console.log('📤 From:', config.email.brevo.fromEmail);
      console.log('📧 To:', to);
      console.log('🔑 Brevo API Key:', config.email.brevo.apiKey ? config.email.brevo.apiKey.substring(0, 15) + '...' : 'NOT SET');
      
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #667eea;">✅ Brevo Email Configuration Test</h2>
          <p>This is a test email to verify that the Brevo email service is working correctly.</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <p><strong>Service:</strong> Brevo REST API (Direct)</p>
          <p><strong>From:</strong> ${config.email.brevo.fromEmail}</p>
          <p><strong>To:</strong> ${to}</p>
          <p><strong>Status:</strong> Email delivery successful!</p>
          <div style="background: #e7f3ff; border: 1px solid #b3d9ff; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #0066cc;">
              <strong>🎉 Great news!</strong> Brevo allows sending emails to any address without domain verification!
            </p>
          </div>
          <hr style="margin: 20px 0; border: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 14px;">
            This email was sent from Nirma StudyBuddy Portal using Brevo REST API as a configuration test.
          </p>
        </div>
      `;

      const textContent = `
✅ BREVO EMAIL CONFIGURATION TEST

This is a test email to verify that the Brevo email service is working correctly.

Timestamp: ${new Date().toISOString()}
Service: Brevo REST API (Direct)
From: ${config.email.brevo.fromEmail}
To: ${to}
Status: Email delivery successful!

🎉 Great news! Brevo allows sending emails to any address without domain verification!

---
This email was sent from Nirma StudyBuddy Portal using Brevo REST API as a configuration test.
      `;

      return await this.sendSingleEmail(
        to,
        '✅ Test Email from Nirma StudyBuddy Portal (Brevo REST API)',
        htmlContent,
        textContent
      );
    } catch (error: any) {
      console.error('❌ Brevo test email failed:', error);
      return {
        success: false,
        messageId: undefined,
        error: error.message || 'Unknown Brevo error'
      };
    }
  }
}

// Export singleton instance
export const brevoEmailService = BrevoEmailService.getInstance(); 