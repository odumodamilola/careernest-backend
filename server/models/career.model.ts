import mongoose, { Schema, Document } from "mongoose";
import { Career } from "@shared/schema";

export interface ICareer extends Career, Document {
  createdAt: Date;
  updatedAt: Date;
}

const CareerSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  salary: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: "USD"
    }
  },
  skills: [{
    type: String,
    required: true
  }],
  education: {
    type: String,
    required: true
  },
  industry: {
    type: String,
    required: true
  },
  jobOutlook: {
    type: String,
    required: true
  },
  resources: [{
    title: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
});

export default mongoose.model<ICareer>("Career", CareerSchema);
