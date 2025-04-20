import mongoose, { Document, Schema } from 'mongoose';
import { Career as CareerType } from '@shared/schema';

export interface ICareer extends CareerType, Document {}

const CareerSchema = new Schema<ICareer>({
  title: {
    type: String,
    required: [true, 'Please provide a career title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a career description']
  },
  requirements: {
    type: [String],
    required: [true, 'Please provide career requirements']
  },
  salary: {
    min: {
      type: Number,
      required: [true, 'Please provide minimum salary']
    },
    max: {
      type: Number,
      required: [true, 'Please provide maximum salary']
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  skills: {
    type: [String],
    required: [true, 'Please provide required skills']
  },
  demand: {
    type: String
  },
  growthRate: {
    type: Number
  },
  categories: {
    type: [String]
  }
}, {
  timestamps: true
});

export default mongoose.model<ICareer>('Career', CareerSchema);
