// Configuration settings for the application
export const config = {
  mongodb: {
    uri: process.env.MONGODB_URI,
    dbName: process.env.MONGODB_DBNAME || 'nirma-studybuddy-v2',
    collections: {
      users: 'users',
      courses: 'courses',
      assignments: 'assignments',
      events: 'events',
      materials: 'study_materials',
      grades: 'grades',
      notifications: 'notifications',
      sessions: 'user_sessions'
    }
  },
  
  // JWT Configuration - Enhanced security
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '30d', // 30 days for better UX
    refreshExpiresIn: '90d' // 90 days for refresh tokens
  },
  
  // App Configuration
  app: {
    name: 'Nirma StudyBuddy Portal v2.0',
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development',
    url: process.env.NEXTAUTH_URL || 'http://localhost:3004'
  },
  
  // Security Configuration
  security: {
  bcrypt: {
    saltRounds: 12
    },
    rateLimiting: {
      auth: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxAttempts: 5
      },
      api: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 100
      }
    }
  },

  // Database validation rules
  validation: {
    password: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: false
    },
    email: {
      domains: ['nirma.edu', 'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'] // Add more as needed
    }
  },

  // Email Configuration (Brevo - formerly Sendinblue)
  email: {
    brevo: {
      apiKey: process.env.BREVO_API_KEY,
      fromEmail: process.env.BREVO_FROM_EMAIL,
      fromName: process.env.BREVO_FROM_NAME,
      replyTo: process.env.BREVO_REPLY_TO
    },
    templates: {
      assignment: { subject: 'New Assignment Notification', templateId: null },
      reminder: { subject: 'Assignment Reminder', templateId: null }
    }
  },

  // Admin Configuration
  admin: {
    defaultAdminEmail: process.env.DEFAULT_ADMIN_EMAIL,
    defaultAdminPassword: process.env.DEFAULT_ADMIN_PASSWORD
  }
}; 