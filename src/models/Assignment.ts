import mongoose, { Document, Schema } from 'mongoose';

export interface IAssignment extends Document {
  _id: string;
  title: string;
  description: string;
  courseId: string;
  instructorId: string;
  type: 'assignment' | 'project' | 'lab' | 'quiz' | 'exam';
  maxMarks: number;
  dueDate: Date;
  submissionInstructions: string;
  attachments: Array<{
    filename: string;
    url: string;
    type: string;
  }>;
  submissions: Array<{
    studentId: string;
    submittedAt: Date;
    files: Array<{
      filename: string;
      url: string;
      type: string;
    }>;
    marks?: number;
    feedback?: string;
    status: 'submitted' | 'late' | 'graded';
  }>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema = new Schema<IAssignment>({
  title: {
    type: String,
    required: [true, 'Assignment title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Assignment description is required']
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course ID is required']
  },
  instructorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Instructor ID is required']
  },
  type: {
    type: String,
    enum: ['assignment', 'project', 'lab', 'quiz', 'exam'],
    default: 'assignment'
  },
  maxMarks: {
    type: Number,
    required: [true, 'Maximum marks are required'],
    min: [1, 'Maximum marks must be at least 1']
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  submissionInstructions: {
    type: String,
    default: 'Please submit your work before the due date.'
  },
  attachments: [{
    filename: String,
    url: String,
    type: String
  }],
  submissions: [{
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    files: [{
      filename: String,
      url: String,
      type: String
    }],
    marks: {
      type: Number,
      min: 0
    },
    feedback: String,
    status: {
      type: String,
      enum: ['submitted', 'late', 'graded'],
      default: 'submitted'
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
AssignmentSchema.index({ courseId: 1 });
AssignmentSchema.index({ instructorId: 1 });
AssignmentSchema.index({ dueDate: 1 });
AssignmentSchema.index({ type: 1 });
AssignmentSchema.index({ 'submissions.studentId': 1 });

export const Assignment = mongoose.models.Assignment || mongoose.model<IAssignment>('Assignment', AssignmentSchema); 