import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  _id: string;
  courseCode: string;
  title: string;
  description: string;
  credits: number;
  semester: number;
  department: string;
  faculty: {
    name: string;
    email?: string;
    phone?: string;
    office?: string;
  };
  schedule: {
    days: string[];
    time: string;
    location: string;
  };
  syllabus: {
    topics: Array<{
      week: number;
      topic: string;
      description?: string;
    }>;
    objectives: string[];
    outcomes: string[];
    textbooks: Array<{
      title: string;
      author: string;
      isbn?: string;
    }>;
    references: Array<{
      title: string;
      author: string;
      type: 'book' | 'journal' | 'website' | 'other';
    }>;
  };
  assessment: {
    midterm: number;
    endterm: number;
    assignments: number;
    quiz: number;
    practical: number;
  };
  students: string[]; // Array of user IDs
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>({
  courseCode: {
    type: String,
    required: [true, 'Course code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Course description is required']
  },
  credits: {
    type: Number,
    required: [true, 'Credits are required'],
    min: [1, 'Credits must be at least 1'],
    max: [6, 'Credits cannot exceed 6']
  },
  semester: {
    type: Number,
    required: [true, 'Semester is required'],
    min: [1, 'Semester must be at least 1'],
    max: [4, 'Semester cannot exceed 4']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    default: 'Computer Science'
  },
  faculty: {
    name: {
      type: String,
      required: [true, 'Faculty name is required']
    },
    email: String,
    phone: String,
    office: String
  },
  schedule: {
    days: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    }],
    time: String,
    location: String
  },
  syllabus: {
    topics: [{
      week: Number,
      topic: String,
      description: String
    }],
    objectives: [String],
    outcomes: [String],
    textbooks: [{
      title: String,
      author: String,
      isbn: String
    }],
    references: [{
      title: String,
      author: String,
      type: {
        type: String,
        enum: ['book', 'journal', 'website', 'other'],
        default: 'book'
      }
    }]
  },
  assessment: {
    midterm: {
      type: Number,
      default: 30,
      min: 0,
      max: 100
    },
    endterm: {
      type: Number,
      default: 40,
      min: 0,
      max: 100
    },
    assignments: {
      type: Number,
      default: 20,
      min: 0,
      max: 100
    },
    quiz: {
      type: Number,
      default: 10,
      min: 0,
      max: 100
    },
    practical: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
CourseSchema.index({ courseCode: 1 });
CourseSchema.index({ semester: 1 });
CourseSchema.index({ department: 1 });
CourseSchema.index({ 'faculty.name': 1 });

export const Course = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema); 