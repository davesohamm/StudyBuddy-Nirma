import mongoose, { Document, Schema, Model } from 'mongoose';

// Assignment interface
export interface IAssignment extends Document {
  title: string;
  subject: string;
  faculty: string;
  dueDate: Date;
  marks: number;
  instructions: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'cancelled';
  attachments?: string[];
  tags?: string[];
  estimatedHours?: number;
  submissionType: 'individual' | 'group';
  groupSize?: number;
  allowLateSubmission: boolean;
  latePenalty?: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  emailSent: boolean;
  emailSentAt?: Date;
  studentsNotified: string[]; // Array of student email IDs
  reminderSent: boolean;
  reminderSentAt?: Date;
}

// Assignment schema
const AssignmentSchema = new Schema<IAssignment>({
  title: {
    type: String,
    required: [true, 'Assignment title is required'],
    trim: true,
    maxLength: [200, 'Title cannot exceed 200 characters']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxLength: [100, 'Subject cannot exceed 100 characters']
  },
  faculty: {
    type: String,
    required: [true, 'Faculty name is required'],
    trim: true,
    maxLength: [100, 'Faculty name cannot exceed 100 characters']
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
    validate: {
      validator: function(date: Date) {
        return date > new Date();
      },
      message: 'Due date must be in the future'
    }
  },
  marks: {
    type: Number,
    required: [true, 'Marks are required'],
    min: [1, 'Marks must be at least 1'],
    max: [100, 'Marks cannot exceed 100']
  },
  instructions: {
    type: String,
    required: [true, 'Instructions are required'],
    trim: true,
    maxLength: [2000, 'Instructions cannot exceed 2000 characters']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active',
    required: true
  },
  attachments: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true,
    maxLength: [50, 'Tag cannot exceed 50 characters']
  }],
  estimatedHours: {
    type: Number,
    min: [0.5, 'Estimated hours must be at least 0.5'],
    max: [100, 'Estimated hours cannot exceed 100']
  },
  submissionType: {
    type: String,
    enum: ['individual', 'group'],
    default: 'individual',
    required: true
  },
  groupSize: {
    type: Number,
    min: [2, 'Group size must be at least 2'],
    max: [10, 'Group size cannot exceed 10'],
    validate: {
      validator: function(this: IAssignment, size?: number) {
        if (this.submissionType === 'group') {
          return size != null && size >= 2;
        }
        return true;
      },
      message: 'Group size is required for group assignments'
    }
  },
  allowLateSubmission: {
    type: Boolean,
    default: false
  },
  latePenalty: {
      type: Number,
    min: [0, 'Late penalty cannot be negative'],
    max: [100, 'Late penalty cannot exceed 100%'],
    validate: {
      validator: function(this: IAssignment, penalty?: number) {
        if (this.allowLateSubmission) {
          return penalty != null && penalty >= 0;
        }
        return true;
      },
      message: 'Late penalty is required when late submission is allowed'
    }
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Created by user is required']
  },
  emailSent: {
    type: Boolean,
    default: false
  },
  emailSentAt: {
    type: Date
  },
  studentsNotified: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  reminderSent: {
    type: Boolean,
    default: false
  },
  reminderSentAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
AssignmentSchema.index({ createdBy: 1, status: 1 });
AssignmentSchema.index({ dueDate: 1, status: 1 });
AssignmentSchema.index({ subject: 1, status: 1 });
AssignmentSchema.index({ priority: 1, dueDate: 1 });

// Virtual for time remaining
AssignmentSchema.virtual('timeRemaining').get(function() {
  const now = new Date();
  const due = new Date(this.dueDate);
  const diffMs = due.getTime() - now.getTime();
  
  if (diffMs <= 0) return 'Overdue';
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} remaining`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} remaining`;
  
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${minutes} minute${minutes > 1 ? 's' : ''} remaining`;
});

// Virtual for overdue status
AssignmentSchema.virtual('isOverdue').get(function() {
  return new Date() > new Date(this.dueDate);
});

// Virtual for urgency level
AssignmentSchema.virtual('urgencyLevel').get(function() {
  const now = new Date();
  const due = new Date(this.dueDate);
  const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  if (diffHours < 0) return 'overdue';
  if (diffHours <= 24) return 'urgent';
  if (diffHours <= 72) return 'soon';
  return 'normal';
});

// Static methods
AssignmentSchema.statics.findBySubject = function(subject: string) {
  return this.find({ subject: new RegExp(subject, 'i'), status: 'active' });
};

AssignmentSchema.statics.findByFaculty = function(faculty: string) {
  return this.find({ faculty: new RegExp(faculty, 'i'), status: 'active' });
};

AssignmentSchema.statics.findByPriority = function(priority: string) {
  return this.find({ priority, status: 'active' });
};

AssignmentSchema.statics.findDueSoon = function(hours: number = 24) {
  const soon = new Date();
  soon.setHours(soon.getHours() + hours);
  
  return this.find({
    status: 'active',
    dueDate: { $lte: soon, $gte: new Date() }
  });
};

AssignmentSchema.statics.findOverdue = function() {
  return this.find({
    status: 'active',
    dueDate: { $lt: new Date() }
  });
};

// Instance methods
AssignmentSchema.methods.markEmailSent = function(studentEmails: string[]) {
  this.emailSent = true;
  this.emailSentAt = new Date();
  this.studentsNotified = Array.from(new Set([...this.studentsNotified, ...studentEmails]));
  return this.save();
};

AssignmentSchema.methods.markReminderSent = function() {
  this.reminderSent = true;
  this.reminderSentAt = new Date();
  return this.save();
};

AssignmentSchema.methods.updateStatus = function(status: 'active' | 'completed' | 'cancelled') {
  this.status = status;
  return this.save();
};

// Pre-save middleware
AssignmentSchema.pre('save', function(next) {
  if (this.isModified('dueDate')) {
    this.reminderSent = false;
    this.reminderSentAt = undefined;
  }
  next();
});

// Create and export the model
const Assignment: Model<IAssignment> = mongoose.models.Assignment || mongoose.model<IAssignment>('Assignment', AssignmentSchema);

export default Assignment; 