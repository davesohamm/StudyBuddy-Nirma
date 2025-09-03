import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IStudyMaterial extends Document {
  _id: string;
  title?: string;
  url: string;
  courseId: string;
  uploadedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const StudyMaterialSchema = new Schema<IStudyMaterial>({
  title: {
    type: String,
    trim: true,
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
    trim:true,
  },
  courseId: {
    type: String,
    required: [true, 'Course ID is required']
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploader ID is required']
  },
}, {
  timestamps: true
});

// Indexes for better query performance
StudyMaterialSchema.index({ courseId: 1 });
StudyMaterialSchema.index({ uploadedBy: 1 });

export const StudyMaterial = mongoose.models.StudyMaterial || mongoose.model<IStudyMaterial>('StudyMaterial', StudyMaterialSchema); 