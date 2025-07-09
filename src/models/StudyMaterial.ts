import mongoose, { Document, Schema } from 'mongoose';

export interface IStudyMaterial extends Document {
  _id: string;
  title: string;
  description: string;
  courseId: string;
  uploadedBy: string;
  type: 'lecture_notes' | 'assignment' | 'reference' | 'video' | 'book' | 'paper' | 'other';
  category: string; // e.g., "Week 1", "Midterm Prep", "Project Resources"
  files: Array<{
    filename: string;
    originalName: string;
    url: string;
    size: number;
    mimeType: string;
  }>;
  tags: string[];
  downloadCount: number;
  isPublic: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StudyMaterialSchema = new Schema<IStudyMaterial>({
  title: {
    type: String,
    required: [true, 'Study material title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Study material description is required']
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course ID is required']
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploader ID is required']
  },
  type: {
    type: String,
    enum: ['lecture_notes', 'assignment', 'reference', 'video', 'book', 'paper', 'other'],
    default: 'other'
  },
  category: {
    type: String,
    trim: true,
    default: 'General'
  },
  files: [{
    filename: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    }
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  downloadCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
StudyMaterialSchema.index({ courseId: 1 });
StudyMaterialSchema.index({ uploadedBy: 1 });
StudyMaterialSchema.index({ type: 1 });
StudyMaterialSchema.index({ tags: 1 });
StudyMaterialSchema.index({ isPublic: 1 });

export const StudyMaterial = mongoose.models.StudyMaterial || mongoose.model<IStudyMaterial>('StudyMaterial', StudyMaterialSchema); 