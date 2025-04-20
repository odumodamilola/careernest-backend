import mongoose, { Document, Schema } from 'mongoose';
import { Assessment as AssessmentType, AssessmentResult as AssessmentResultType } from '@shared/schema';

export interface IAssessment extends AssessmentType, Document {}
export interface IAssessmentResult extends AssessmentResultType, Document {}

const OptionSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    select: false // Hide correct answers by default
  }
});

const QuestionSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: [true, 'Please provide a question text']
  },
  options: {
    type: [OptionSchema],
    required: [true, 'Please provide answer options']
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'open-ended'],
    required: [true, 'Please specify the question type']
  },
  points: {
    type: Number,
    default: 1
  }
});

const AssessmentSchema = new Schema<IAssessment>({
  title: {
    type: String,
    required: [true, 'Please provide an assessment title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide an assessment description']
  },
  timeLimit: {
    type: Number // Time limit in minutes
  },
  questions: {
    type: [QuestionSchema],
    required: [true, 'Please provide assessment questions']
  },
  category: {
    type: String
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced']
  }
}, {
  timestamps: true
});

const AnswerSchema = new Schema({
  questionId: {
    type: String,
    required: true
  },
  selectedOptionId: {
    type: String
  },
  openAnswer: {
    type: String
  },
  isCorrect: {
    type: Boolean
  },
  points: {
    type: Number,
    default: 0
  }
});

const AssessmentResultSchema = new Schema<IAssessmentResult>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user ID']
  },
  assessmentId: {
    type: Schema.Types.ObjectId,
    ref: 'Assessment',
    required: [true, 'Please provide an assessment ID']
  },
  score: {
    type: Number,
    required: [true, 'Please provide a score']
  },
  totalPoints: {
    type: Number,
    required: [true, 'Please provide total points']
  },
  answers: {
    type: [AnswerSchema],
    required: [true, 'Please provide answers']
  },
  timeTaken: {
    type: Number // Time taken in seconds
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

export const Assessment = mongoose.model<IAssessment>('Assessment', AssessmentSchema);
export const AssessmentResult = mongoose.model<IAssessmentResult>('AssessmentResult', AssessmentResultSchema);
