import mongoose, { Document, Schema } from 'mongoose';

// Enhanced User Interface with better structure
export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'student' | 'faculty' | 'admin';
  
  // Authentication & Security
  emailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastPasswordChange?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  
  // User Profile
  profile: {
    // Personal Information
    firstName: string;
    lastName: string;
    avatar?: string;
    bio?: string;
    
    // Contact Information
    phone?: string;
    address?: {
      street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
    };
    
    // Academic Information (for students)
    academic?: {
      studentId?: string;
      enrollmentNumber?: string;
    program?: string;
    department?: string;
      semester?: number;
      batch?: string;
    enrollmentYear?: number;
      expectedGraduation?: Date;
    cgpa?: number;
      currentCourses?: string[];
    };
    
    // Professional Information (for faculty)
    professional?: {
      employeeId?: string;
      designation?: string;
      department?: string;
      qualification?: string[];
      experience?: number;
      specialization?: string[];
      officeLocation?: string;
      officeHours?: string;
    };
    
    // Personal Details
    dateOfBirth?: Date;
    gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
    nationality?: string;
    languages?: string[];
    
    // Skills & Interests
    skills?: string[];
    interests?: string[];
    achievements?: string[];
    
    // Social Links
    socialLinks?: {
      linkedin?: string;
      github?: string;
      twitter?: string;
      portfolio?: string;
      other?: { name: string; url: string }[];
    };
    
    // Emergency Contact
    emergencyContact?: {
      name: string;
      relationship: string;
      phone: string;
      email?: string;
    };
  };
    
  // User Preferences & Settings
  preferences: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
      assignment: boolean;
      course: boolean;
      announcement: boolean;
      deadline: boolean;
    };
    privacy: {
      profileVisibility: 'public' | 'private' | 'college-only';
      showEmail: boolean;
      showPhone: boolean;
      showSocialLinks: boolean;
    };
    display: {
      theme: 'light' | 'dark' | 'auto';
      language: string;
      timezone: string;
      dateFormat: string;
      timeFormat: '12h' | '24h';
    };
    dashboard: {
      defaultView: 'grid' | 'list';
      showStats: boolean;
      compactMode: boolean;
    };
  };
  
  // System fields
  isActive: boolean;
  isVerified: boolean;
  lastLogin?: Date;
  lastActivity?: Date;
  metadata?: {
    source?: string; // How they signed up
    referrer?: string;
    ipAddress?: string;
    userAgent?: string;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

// Enhanced User Schema with better validation and indexing
const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minLength: [2, 'Name must be at least 2 characters'],
    maxLength: [100, 'Name cannot exceed 100 characters']
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
    index: true
  },
  
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [8, 'Password must be at least 8 characters'],
    select: false // Never include password in queries by default
  },
  
  role: {
    type: String,
    enum: ['student', 'faculty', 'admin'],
    default: 'student',
    index: true
  },
  
  // Authentication & Security
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastPasswordChange: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  
  // User Profile
  profile: {
    // Personal Information
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxLength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxLength: [50, 'Last name cannot exceed 50 characters']
    },
    avatar: String,
    bio: {
      type: String,
      maxLength: [500, 'Bio cannot exceed 500 characters']
    },
    
    // Contact Information
    phone: {
      type: String,
      match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
    },
    address: {
      street: String,
    city: String,
    state: String,
    country: String,
      zipCode: String
    },
    
    // Academic Information
    academic: {
      studentId: {
        type: String,
        sparse: true,
        index: true
      },
      enrollmentNumber: String,
    program: {
      type: String,
      default: 'MTech Data Science'
    },
    department: {
      type: String,
      default: 'Computer Science'
    },
      semester: {
        type: Number,
        min: 1,
        max: 4
      },
      batch: String,
    enrollmentYear: Number,
      expectedGraduation: Date,
    cgpa: {
      type: Number,
      min: 0,
      max: 10
    },
      currentCourses: [String]
    },
    
    // Professional Information
    professional: {
      employeeId: String,
      designation: String,
      department: String,
      qualification: [String],
      experience: Number,
      specialization: [String],
      officeLocation: String,
      officeHours: String
    },
    
    // Personal Details
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['', 'male', 'female', 'other', 'prefer-not-to-say'],
      default: ''
    },
    nationality: String,
    languages: [String],
    
    // Skills & Interests
    skills: [String],
    interests: [String],
    achievements: [String],
    
    // Social Links
    socialLinks: {
      linkedin: String,
      github: String,
      twitter: String,
      portfolio: String,
      other: [{
        name: String,
        url: String
      }]
    },
    
    // Emergency Contact
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
      email: String
    }
    },
    
  // User Preferences & Settings
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      assignment: { type: Boolean, default: true },
      course: { type: Boolean, default: true },
      announcement: { type: Boolean, default: true },
      deadline: { type: Boolean, default: true }
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'private', 'college-only'],
        default: 'college-only'
      },
      showEmail: { type: Boolean, default: false },
      showPhone: { type: Boolean, default: false },
      showSocialLinks: { type: Boolean, default: true }
    },
    display: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'auto'],
        default: 'light'
      },
      language: { type: String, default: 'en' },
      timezone: { type: String, default: 'Asia/Kolkata' },
      dateFormat: { type: String, default: 'DD/MM/YYYY' },
      timeFormat: {
        type: String,
        enum: ['12h', '24h'],
        default: '12h'
      }
    },
    dashboard: {
      defaultView: {
        type: String,
        enum: ['grid', 'list'],
        default: 'grid'
      },
      showStats: { type: Boolean, default: true },
      compactMode: { type: Boolean, default: false }
    }
  },
  
  // System fields
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: Date,
  lastActivity: Date,
  metadata: {
    source: String,
    referrer: String,
    ipAddress: String,
    userAgent: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      const obj = ret as any;
      delete obj.password;
      delete obj.emailVerificationToken;
      delete obj.passwordResetToken;
      delete obj.__v;
      return ret;
    }
  }
});

// Virtual fields
UserSchema.virtual('fullName').get(function(this: IUser) {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

UserSchema.virtual('isLocked').get(function(this: IUser) {
  return !!(this.lockUntil && this.lockUntil > new Date());
});

// Indexes for better performance
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ 'profile.academic.studentId': 1 }, { sparse: true });
UserSchema.index({ 'profile.professional.employeeId': 1 }, { sparse: true });
UserSchema.index({ 'profile.academic.department': 1 });
UserSchema.index({ 'profile.academic.semester': 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ createdAt: 1 });
UserSchema.index({ lastLogin: 1 });

// Pre-save middleware
UserSchema.pre('save', function(next) {
  // Update the name field when firstName or lastName changes
  if (this.profile.firstName && this.profile.lastName) {
    this.name = `${this.profile.firstName} ${this.profile.lastName}`;
  }
  
  // Update lastActivity
  this.lastActivity = new Date();
  
  next();
});

// Static methods
UserSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

UserSchema.statics.findByStudentId = function(studentId: string) {
  return this.findOne({ 'profile.academic.studentId': studentId });
};

UserSchema.statics.findByRole = function(role: string) {
  return this.find({ role, isActive: true });
};

// Instance methods
UserSchema.methods.incrementLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates: any = { $inc: { loginAttempts: 1 } };
  
  // If we have hit max attempts and it's not locked already, lock the account
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

UserSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema); 