import mongoose, { Schema, Document } from "mongoose";
import { Assessment } from "@shared/schema";

export interface IAssessment extends Assessment, Document {
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentSchema: Schema = new Schema({
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
  timeLimit: {
    type: Number, // Time in minutes
    required: true
  },
  questions: [{
    questionText: {
      type: String,
      required: true
    },
    options: [{
      text: {
        type: String,
        required: true
      },
      isCorrect: {
        type: Boolean,
        required: true
      }
    }],
    explanation: {
      type: String
    }
  }],
  skillsAssessed: [{
    type: String,
    required: true
  }],
  difficulty: {
    type: String,
    required: true,
    enum: ["Beginner", "Intermediate", "Advanced"]
  }
}, {
  timestamps: true
});

// Create index on category for faster lookups
AssessmentSchema.index({ category: 1 });

export default mongoose.model<IAssessment>("Assessment", AssessmentSchema);
