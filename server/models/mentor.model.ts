import mongoose, { Schema, Document } from "mongoose";
import { Mentor } from "@shared/schema";

export interface IMentor extends Mentor, Document {
  createdAt: Date;
  updatedAt: Date;
}

const MentorSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    required: true
  },
  expertise: [{
    type: String,
    required: true
  }],
  yearsOfExperience: {
    type: Number,
    required: true
  },
  profileImage: {
    type: String,
    default: ""
  },
  availability: [{
    day: {
      type: String,
      required: true,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    },
    slots: [{
      startTime: {
        type: String,
        required: true
      },
      endTime: {
        type: String,
        required: true
      },
      isBooked: {
        type: Boolean,
        default: false
      }
    }]
  }],
  rating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model<IMentor>("Mentor", MentorSchema);
