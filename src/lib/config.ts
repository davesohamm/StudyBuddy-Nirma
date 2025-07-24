// Configuration settings for the application
export const config = {
  // MongoDB Connection - Updated connection string
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb+srv://davesohamm:<db_password>@cluster0.egfl0bg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    dbName: 'nirma-studybuddy-v2',
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
    secret: process.env.JWT_SECRET || 'nirma_studybuddy_jwt_secret_2024_v2_ultra_secure_key',
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
      apiKey: process.env.BREVO_API_KEY || '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',
      fromEmail: 'davesohamm1@outlook.com', // Must match your Brevo account email
      fromName: 'Nirma StudyBuddy Portal',
      replyTo: 'davesohamm1@outlook.com'
    },
    templates: {
      assignment: {
        subject: '📚 New Assignment: {{title}}',
        templateId: null // We'll use custom HTML instead of templates
      },
      reminder: {
        subject: '⏰ Assignment Due Tomorrow: {{title}}',
        templateId: null
      }
    }
  },

  // Admin Configuration
  admin: {
    defaultAdminEmail: 'davesohamm@gmail.com',
    defaultAdminPassword: 'Thor@123' // Only for initial setup
  }
}; 