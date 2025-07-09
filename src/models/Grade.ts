import mongoose, { Document, Schema } from 'mongoose';

export interface IGrade extends Document {
  _id: string;
  studentId: string;
  courseId: string;
  semester: number;
  academicYear: string; // e.g., "2024-25"
  assessments: Array<{
    type: 'midterm' | 'endterm' | 'assignment' | 'quiz' | 'practical' | 'project';
    title: string;
    marksObtained: number;
    maxMarks: number;
    weightage: number; // percentage weightage
    date: Date;
  }>;
  totalMarks: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  gradePoints: number; // 4.0 scale
  credits: number;
  attendance: {
    totalClasses: number;
    classesAttended: number;
    percentage: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISemesterGPA extends Document {
  _id: string;
  studentId: string;
  semester: number;
  academicYear: string;
  courses: Array<{
    courseId: string;
    gradeId: string;
    credits: number;
    gradePoints: number;
  }>;
  totalCredits: number;
  totalGradePoints: number;
  sgpa: number; // Semester GPA
  cgpa: number; // Cumulative GPA
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GradeSchema = new Schema<IGrade>({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student ID is required']
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course ID is required']
  },
  semester: {
    type: Number,
    required: [true, 'Semester is required'],
    min: 1,
    max: 4
  },
  academicYear: {
    type: String,
    required: [true, 'Academic year is required'],
    match: /^\d{4}-\d{2}$/ // Format: 2024-25
  },
  assessments: [{
    type: {
      type: String,
      enum: ['midterm', 'endterm', 'assignment', 'quiz', 'practical', 'project'],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    marksObtained: {
      type: Number,
      required: true,
      min: 0
    },
    maxMarks: {
      type: Number,
      required: true,
      min: 1
    },
    weightage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  totalMarks: {
    type: Number,
    min: 0,
    max: 100
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F']
  },
  gradePoints: {
    type: Number,
    min: 0,
    max: 10
  },
  credits: {
    type: Number,
    required: [true, 'Credits are required'],
    min: 1,
    max: 6
  },
  attendance: {
    totalClasses: {
      type: Number,
      default: 0,
      min: 0
    },
    classesAttended: {
      type: Number,
      default: 0,
      min: 0
    },
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const SemesterGPASchema = new Schema<ISemesterGPA>({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student ID is required']
  },
  semester: {
    type: Number,
    required: [true, 'Semester is required'],
    min: 1,
    max: 4
  },
  academicYear: {
    type: String,
    required: [true, 'Academic year is required'],
    match: /^\d{4}-\d{2}$/
  },
  courses: [{
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course'
    },
    gradeId: {
      type: Schema.Types.ObjectId,
      ref: 'Grade'
    },
    credits: Number,
    gradePoints: Number
  }],
  totalCredits: {
    type: Number,
    default: 0,
    min: 0
  },
  totalGradePoints: {
    type: Number,
    default: 0,
    min: 0
  },
  sgpa: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  cgpa: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
GradeSchema.index({ studentId: 1, courseId: 1 }, { unique: true });
GradeSchema.index({ semester: 1 });
GradeSchema.index({ academicYear: 1 });

SemesterGPASchema.index({ studentId: 1, semester: 1, academicYear: 1 }, { unique: true });

export const Grade = mongoose.models.Grade || mongoose.model<IGrade>('Grade', GradeSchema);
export const SemesterGPA = mongoose.models.SemesterGPA || mongoose.model<ISemesterGPA>('SemesterGPA', SemesterGPASchema); 