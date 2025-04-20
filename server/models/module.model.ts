import mongoose, { Schema, Document } from "mongoose";
import { Module } from "@shared/schema";

export interface IModule extends Module, Document {
  createdAt: Date;
  updatedAt: Date;
}

const ModuleSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: Number, // Duration in minutes
    required: true
  },
  level: {
    type: String,
    required: true,
    enum: ["Beginner", "Intermediate", "Advanced"]
  },
  content: [{
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ["Video", "Article", "Quiz", "Exercise"]
    },
    data: {
      type: Schema.Types.Mixed,
      required: true
    }
  }],
  prerequisites: [{
    type: String
  }],
  outcomes: [{
    type: String,
    required: true
  }],
  author: {
    name: {
      type: String,
      required: true
    },
    bio: {
      type: String
    }
  },
  relatedCareers: [{
    type: Schema.Types.ObjectId,
    ref: "Career"
  }]
}, {
  timestamps: true
});

// Create index on category and level for faster lookups
ModuleSchema.index({ category: 1, level: 1 });

export default mongoose.model<IModule>("Module", ModuleSchema);
