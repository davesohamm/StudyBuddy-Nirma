// Configuration settings for the application
export const config = {
  // MongoDB Connection
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb+srv://davesohamm:ajRr8qBUeBQ9TNXf@cluster0.egfl0bg.mongodb.net/nirma-studybuddy?retryWrites=true&w=majority&appName=Cluster0',
    dbName: 'nirma-studybuddy'
  },
  
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'nirma_studybuddy_jwt_secret_key_2024_secure_random_string',
    expiresIn: '7d'
  },
  
  // App Configuration
  app: {
    name: 'Nirma StudyBuddy Portal',
    environment: process.env.NODE_ENV || 'development',
    url: process.env.NEXTAUTH_URL || 'http://localhost:3004'
  },
  
  // Security
  bcrypt: {
    saltRounds: 12
  }
}; 