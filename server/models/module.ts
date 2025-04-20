import mongoose, { Document, Schema } from 'mongoose';
import { Module as ModuleType, ModuleCompletion as ModuleCompletionType } from '@shared/schema';

export interface IModule extends ModuleType, Document {}
export interface IModuleCompletion extends ModuleCompletionType, Document {}

const ResourceSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a resource title']
  },
  url: {
    type: String,
    required: [true, 'Please provide a resource URL']
  },
  type: {
    type: String,
    enum: ['video', 'article', 'ebook', 'other'],
    required: [true, 'Please specify the resource type']
  }
});

const ModuleSchema = new Schema<IModule>({
  title: {
    type: String,
    required: [true, 'Please provide a module title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a module description']
  },
  content: {
    type: String,
    required: [true, 'Please provide module content']
  },
  estimatedTime: {
    type: Number // Estimated time in minutes
  },
  category: {
    type: String
  },
  prerequisites: {
    type: [String]
  },
  resources: {
    type: [ResourceSchema],
    default: []
  }
}, {
  timestamps: true
});

const ModuleCompletionSchema = new Schema<IModuleCompletion>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user ID']
  },
  moduleId: {
    type: Schema.Types.ObjectId,
    ref: 'Module',
    required: [true, 'Please provide a module ID']
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  feedback: {
    type: String
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  }
});

export const Module = mongoose.model<IModule>('Module', ModuleSchema);
export const ModuleCompletion = mongoose.model<IModuleCompletion>('ModuleCompletion', ModuleCompletionSchema);
