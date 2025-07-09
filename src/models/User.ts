import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  profile: {
    // Basic Info
    firstName?: string;
    lastName?: string;
    studentId?: string;
    profileImage?: string;
    bio?: string;
    
    // Contact Info
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
    
    // Academic Info
    semester?: number;
    program?: string;
    department?: string;
    enrollmentYear?: number;
    graduationYear?: number;
    cgpa?: number;
    
    // Personal Info
    dateOfBirth?: Date;
    gender?: string;
    nationality?: string;
    
    // Social Links
    socialLinks?: {
      linkedin?: string;
      github?: string;
      twitter?: string;
      instagram?: string;
      website?: string;
    };
    
    // Academic Interests
    interests?: string[];
    skills?: string[];
    languages?: string[];
    
    // Emergency Contact
    emergencyContact?: {
      name?: string;
      relationship?: string;
      phone?: string;
      email?: string;
    };
    
    // Additional Custom Fields
    customFields?: {
      fieldName: string;
      fieldValue: string;
    }[];
  };
  settings: {
    notifications: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
    theme: 'light' | 'dark';
    language: string;
    timezone: string;
    privacy: {
      profileVisibility: 'public' | 'private' | 'friends';
      showEmail: boolean;
      showPhone: boolean;
      showAddress: boolean;
    };
  };
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxLength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  profile: {
    // Basic Info
    firstName: String,
    lastName: String,
    studentId: String,
    profileImage: String,
    bio: {
      type: String,
      maxLength: [500, 'Bio cannot exceed 500 characters']
    },
    
    // Contact Info
    phone: String,
    address: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
    
    // Academic Info
    semester: {
      type: Number,
      min: 1,
      max: 4
    },
    program: {
      type: String,
      default: 'MTech Data Science'
    },
    department: {
      type: String,
      default: 'Computer Science'
    },
    enrollmentYear: Number,
    graduationYear: Number,
    cgpa: {
      type: Number,
      min: 0,
      max: 10
    },
    
    // Personal Info
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer-not-to-say']
    },
    nationality: String,
    
    // Social Links
    socialLinks: {
      linkedin: String,
      github: String,
      twitter: String,
      instagram: String,
      website: String
    },
    
    // Academic Interests
    interests: [String],
    skills: [String],
    languages: [String],
    
    // Emergency Contact
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
      email: String
    },
    
    // Additional Custom Fields
    customFields: [{
      fieldName: String,
      fieldValue: String
    }]
  },
  settings: {
    notifications: {
      type: Boolean,
      default: true
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    smsNotifications: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    language: {
      type: String,
      default: 'en'
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'private', 'friends'],
        default: 'public'
      },
      showEmail: {
        type: Boolean,
        default: false
      },
      showPhone: {
        type: Boolean,
        default: false
      },
      showAddress: {
        type: Boolean,
        default: false
      }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date
}, {
  timestamps: true
});

// Indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ 'profile.studentId': 1 });
UserSchema.index({ 'profile.department': 1 });
UserSchema.index({ 'profile.semester': 1 });

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema); 