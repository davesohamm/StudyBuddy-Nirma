import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IEvent extends Document {
  _id: string;
  title: string;
  description: string;
  type: 'exam' | 'assignment' | 'project' | 'seminar' | 'workshop' | 'holiday' | 'other';
  courseId?: Types.ObjectId;
  organizerId: Types.ObjectId;
  startDate: Date;
  endDate?: Date;
  location?: string;
  isAllDay: boolean;
  reminder: {
    enabled: boolean;
    time: number; // minutes before event
  };
  participants: Types.ObjectId[]; // Array of user ObjectIDs
  priority: 'low' | 'medium' | 'high';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Event description is required']
  },
  type: {
    type: String,
    enum: ['exam', 'assignment', 'project', 'seminar', 'workshop', 'holiday', 'other'],
    default: 'other'
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course'
  },
  organizerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Organizer ID is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date
  },
  location: {
    type: String,
    trim: true
  },
  isAllDay: {
    type: Boolean,
    default: false
  },
  reminder: {
    enabled: {
      type: Boolean,
      default: true
    },
    time: {
      type: Number,
      default: 60 // 1 hour before
    }
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
EventSchema.index({ startDate: 1 });
EventSchema.index({ type: 1 });
EventSchema.index({ courseId: 1 });
EventSchema.index({ organizerId: 1 });
EventSchema.index({ participants: 1 });

export const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema); 