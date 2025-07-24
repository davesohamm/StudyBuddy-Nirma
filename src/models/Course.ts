import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  _id: string;
  courseCode: string;
  title: string;
  description: string;
  credits: number;
  category: 'core' | 'elective' | 'project' | 'lab' | 'seminar';
  status: 'active' | 'inactive' | 'archived';
  
  // Academic Information
  academic: {
  semester: number;
  department: string;
    program: string;
    prerequisites?: string[];
    corequisites?: string[];
    maxStudents?: number;
    minStudents?: number;
  };
  
  // Faculty Information
  faculty: {
    primary: {
      id: string;
    name: string;
      email: string;
    phone?: string;
      officeLocation?: string;
  };
    secondary?: {
      id: string;
      name: string;
      email: string;
      role: 'co-instructor' | 'lab-assistant' | 'guest-lecturer';
    }[];
  };
  
  // Schedule Information
  schedule: {
    lectures?: {
      day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
      startTime: string;
      endTime: string;
      location: string;
    }[];
    labs?: {
      day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
      startTime: string;
      endTime: string;
      location: string;
    }[];
    tutorials?: {
      day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
      startTime: string;
      endTime: string;
    location: string;
    }[];
  };
  
  // Course Content
  syllabus: {
    objectives: string[];
    outcomes: string[];
    modules: {
      title: string;
      description: string;
      topics: string[];
      hours: number;
      weightage?: number;
    }[];
    textbooks: {
      title: string;
      author: string;
      edition?: string;
      publisher?: string;
      isbn?: string;
      type: 'primary' | 'secondary' | 'reference';
    }[];
    references: {
      title: string;
      author?: string;
      type: 'book' | 'paper' | 'website' | 'video' | 'other';
      url?: string;
      description?: string;
    }[];
  };
  
  // Assessment Structure
  assessment: {
    components: {
      name: string;
      type: 'exam' | 'assignment' | 'project' | 'quiz' | 'lab' | 'presentation' | 'viva';
      weightage: number;
      description?: string;
      dueDate?: Date;
    }[];
    gradingScale: {
      grade: string;
      minMarks: number;
      maxMarks: number;
      points: number;
    }[];
  };
  
  // Enrollment
  enrollment: {
    students: string[]; // User IDs
    waitlist?: string[];
    enrollmentStart?: Date;
    enrollmentEnd?: Date;
    dropDeadline?: Date;
  };
  
  // Course Settings
  settings: {
    allowLateSubmissions: boolean;
    latePenalty?: number;
    allowGroupWork: boolean;
    maxGroupSize?: number;
    attendanceRequired: boolean;
    minAttendance?: number;
    emailNotifications: boolean;
  };
  
  // Analytics
  analytics: {
    enrollmentCount: number;
    completionRate?: number;
    averageGrade?: number;
    feedbackRating?: number;
    feedbackCount?: number;
  };
  
  isActive: boolean;
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>({
  courseCode: {
    type: String,
    required: [true, 'Course code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    match: [/^[A-Z]{2,4}\d{3,4}$/, 'Please enter a valid course code (e.g., CS501)']
  },
  
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxLength: [200, 'Course title cannot exceed 200 characters']
  },
  
  description: {
    type: String,
    required: [true, 'Course description is required'],
    maxLength: [2000, 'Course description cannot exceed 2000 characters']
  },
  
  credits: {
    type: Number,
    required: [true, 'Course credits are required'],
    min: [0.5, 'Credits must be at least 0.5'],
    max: [10, 'Credits cannot exceed 10']
  },
  
  category: {
    type: String,
    enum: ['core', 'elective', 'project', 'lab', 'seminar'],
    required: [true, 'Course category is required'],
    index: true
  },
  
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active',
    index: true
  },
  
  academic: {
  semester: {
    type: Number,
    required: [true, 'Semester is required'],
      min: 1,
      max: 4,
      index: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
      index: true
    },
    program: {
      type: String,
      required: [true, 'Program is required'],
      default: 'MTech Data Science'
  },
    prerequisites: [String],
    corequisites: [String],
    maxStudents: {
      type: Number,
      min: 1,
      max: 200
    },
    minStudents: {
      type: Number,
      min: 1,
      max: 50
    }
  },
  
  faculty: {
    primary: {
      id: {
        type: String,
        required: [true, 'Primary faculty ID is required'],
        ref: 'User'
      },
    name: {
      type: String,
        required: [true, 'Primary faculty name is required']
    },
      email: {
        type: String,
        required: [true, 'Primary faculty email is required'],
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
      },
    phone: String,
      officeLocation: String
  },
    secondary: [{
      id: {
        type: String,
        ref: 'User'
      },
      name: String,
      email: {
        type: String,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
      },
      role: {
        type: String,
        enum: ['co-instructor', 'lab-assistant', 'guest-lecturer']
      }
    }]
  },
  
  schedule: {
    lectures: [{
      day: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      },
      startTime: String,
      endTime: String,
      location: String
    }],
    labs: [{
      day: {
      type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      },
      startTime: String,
      endTime: String,
      location: String
    }],
    tutorials: [{
      day: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      },
      startTime: String,
      endTime: String,
    location: String
    }]
  },
  
  syllabus: {
    objectives: [String],
    outcomes: [String],
    modules: [{
      title: {
        type: String,
        required: true
      },
      description: String,
      topics: [String],
      hours: {
        type: Number,
        min: 1
      },
      weightage: Number
    }],
    textbooks: [{
      title: {
        type: String,
        required: true
      },
      author: {
        type: String,
        required: true
      },
      edition: String,
      publisher: String,
      isbn: String,
      type: {
        type: String,
        enum: ['primary', 'secondary', 'reference'],
        default: 'primary'
      }
    }],
    references: [{
      title: {
        type: String,
        required: true
      },
      author: String,
      type: {
        type: String,
        enum: ['book', 'paper', 'website', 'video', 'other'],
        default: 'book'
      },
      url: String,
      description: String
    }]
  },
  
  assessment: {
    components: [{
      name: {
        type: String,
        required: true
      },
      type: {
        type: String,
        enum: ['exam', 'assignment', 'project', 'quiz', 'lab', 'presentation', 'viva'],
        required: true
      },
      weightage: {
      type: Number,
        required: true,
      min: 0,
      max: 100
    },
      description: String,
      dueDate: Date
    }],
    gradingScale: [{
      grade: {
        type: String,
        required: true
      },
      minMarks: {
        type: Number,
        required: true
      },
      maxMarks: {
        type: Number,
        required: true
      },
      points: {
      type: Number,
        required: true
      }
    }]
  },
  
  enrollment: {
    students: [{
      type: String,
      ref: 'User'
    }],
    waitlist: [{
      type: String,
      ref: 'User'
    }],
    enrollmentStart: Date,
    enrollmentEnd: Date,
    dropDeadline: Date
  },
  
  settings: {
    allowLateSubmissions: {
      type: Boolean,
      default: false
    },
    latePenalty: {
      type: Number,
      min: 0,
      max: 100
    },
    allowGroupWork: {
      type: Boolean,
      default: false
    },
    maxGroupSize: {
      type: Number,
      min: 2,
      max: 10
    },
    attendanceRequired: {
      type: Boolean,
      default: true
    },
    minAttendance: {
      type: Number,
      min: 0,
      max: 100,
      default: 75
    },
    emailNotifications: {
      type: Boolean,
      default: true
    }
  },
  
  analytics: {
    enrollmentCount: {
      type: Number,
      default: 0
    },
    completionRate: Number,
    averageGrade: Number,
    feedbackRating: Number,
    feedbackCount: Number
  },
  
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  
  createdBy: {
    type: String,
    required: [true, 'Creator ID is required'],
    ref: 'User'
  },
  
  updatedBy: {
    type: String,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Virtual fields
CourseSchema.virtual('totalEnrollment').get(function(this: ICourse) {
  return this.enrollment.students.length;
});

CourseSchema.virtual('hasWaitlist').get(function(this: ICourse) {
  return this.enrollment.waitlist && this.enrollment.waitlist.length > 0;
});

CourseSchema.virtual('isEnrollmentOpen').get(function(this: ICourse) {
  const now = new Date();
  const start = this.enrollment.enrollmentStart;
  const end = this.enrollment.enrollmentEnd;
  
  if (!start || !end) return true;
  return now >= start && now <= end;
});

// Indexes for better performance
CourseSchema.index({ courseCode: 1 }, { unique: true });
CourseSchema.index({ 'academic.semester': 1 });
CourseSchema.index({ 'academic.department': 1 });
CourseSchema.index({ category: 1 });
CourseSchema.index({ status: 1 });
CourseSchema.index({ 'faculty.primary.id': 1 });
CourseSchema.index({ 'enrollment.students': 1 });
CourseSchema.index({ createdAt: 1 });

// Static methods
CourseSchema.statics.findBySemester = function(semester: number) {
  return this.find({ 'academic.semester': semester, isActive: true });
};

CourseSchema.statics.findByDepartment = function(department: string) {
  return this.find({ 'academic.department': department, isActive: true });
};

CourseSchema.statics.findByFaculty = function(facultyId: string) {
  return this.find({ 'faculty.primary.id': facultyId, isActive: true });
};

CourseSchema.statics.findByStudent = function(studentId: string) {
  return this.find({ 'enrollment.students': studentId, isActive: true });
};

// Instance methods
CourseSchema.methods.enrollStudent = function(studentId: string) {
  if (!this.enrollment.students.includes(studentId)) {
    this.enrollment.students.push(studentId);
    this.analytics.enrollmentCount = this.enrollment.students.length;
  }
  return this.save();
};

CourseSchema.methods.unenrollStudent = function(studentId: string) {
  this.enrollment.students = this.enrollment.students.filter((id: string) => id !== studentId);
  this.analytics.enrollmentCount = this.enrollment.students.length;
  return this.save();
};

CourseSchema.methods.addToWaitlist = function(studentId: string) {
  if (!this.enrollment.waitlist) {
    this.enrollment.waitlist = [];
  }
  if (!this.enrollment.waitlist.includes(studentId)) {
    this.enrollment.waitlist.push(studentId);
  }
  return this.save();
};

export const Course = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema); 