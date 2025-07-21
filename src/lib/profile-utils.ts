// Profile utilities for handling default data and initialization

export interface ProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  isActive: boolean;
  profile: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    bio?: string;
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      zipCode?: string;
    };
    academic?: {
      studentId?: string;
      semester?: number;
      program?: string;
      department?: string;
      enrollmentYear?: number;
      cgpa?: number;
    };
    professional?: {
      company?: string;
      position?: string;
      experience?: number;
    };
    dateOfBirth?: string;
    gender?: string;
    nationality?: string;
    languages?: string[];
    skills?: string[];
    interests?: string[];
    achievements?: string[];
    socialLinks?: {
      linkedin?: string;
      github?: string;
      twitter?: string;
      portfolio?: string;
    };
    emergencyContact?: {
      name?: string;
      relationship?: string;
      phone?: string;
      email?: string;
    };
    customFields?: { fieldName: string; fieldValue: string; }[];
  };
  preferences?: {
    notifications?: {
      email?: boolean;
      push?: boolean;
      sms?: boolean;
    };
    privacy?: {
      profileVisibility?: 'public' | 'private' | 'friends';
      showEmail?: boolean;
      showPhone?: boolean;
    };
    theme?: 'light' | 'dark';
    language?: string;
  };
  lastLogin?: Date;
  lastActivity?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export function getDefaultProfile(): ProfileData['profile'] {
  return {
    firstName: '',
    lastName: '',
    avatar: '',
    bio: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    },
    academic: {
      studentId: '',
      semester: 1,
      program: 'MTech Data Science',
      department: 'Computer Science',
      enrollmentYear: new Date().getFullYear(),
      cgpa: 0
    },
    professional: {
      company: '',
      position: '',
      experience: 0
    },
    dateOfBirth: '',
    gender: '',
    nationality: '',
    languages: [],
    skills: [],
    interests: [],
    achievements: [],
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: '',
      portfolio: ''
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
      email: ''
    },
    customFields: []
  };
}

export function getDefaultPreferences(): ProfileData['preferences'] {
  return {
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false
    },
    theme: 'light',
    language: 'en'
  };
}

export function initializeProfile(user: any): ProfileData {
  return {
    id: user._id?.toString() || user.id,
    name: user.name || '',
    email: user.email || '',
    role: user.role || 'student',
    emailVerified: user.emailVerified || false,
    isActive: user.isActive || true,
    profile: { ...getDefaultProfile(), ...user.profile },
    preferences: { ...getDefaultPreferences(), ...user.preferences },
    lastLogin: user.lastLogin,
    lastActivity: user.lastActivity,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

export function validateProfileData(data: any): boolean {
  console.log('🔍 Validating profile data:', data);
  
  if (!data || typeof data !== 'object') {
    console.log('❌ Validation failed: Data is not an object');
    return false;
  }
  
  if (!data.id && !data._id) {
    console.log('❌ Validation failed: No ID found');
    return false;
  }
  
  if (!data.name || !data.email) {
    console.log('❌ Validation failed: Missing name or email');
    return false;
  }
  
  console.log('✅ Profile data validation passed');
  return true;
} 