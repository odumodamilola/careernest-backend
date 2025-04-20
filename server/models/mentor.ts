import mongoose, { Document, Schema } from 'mongoose';
import { Mentor as MentorType, Session as SessionType } from '@shared/schema';

export interface IMentor extends MentorType, Document {}
export interface ISession extends SessionType, Document {}

const AvailabilitySchema = new Schema({
  day: {
    type: String,
    required: [true, 'Please provide a day']
  },
  startTime: {
    type: String,
    required: [true, 'Please provide a start time']
  },
  endTime: {
    type: String,
    required: [true, 'Please provide an end time']
  }
});

const MentorSchema = new Schema<IMentor>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a title']
  },
  company: {
    type: String,
    required: [true, 'Please provide a company']
  },
  bio: {
    type: String,
    required: [true, 'Please provide a bio']
  },
  expertise: {
    type: [String],
    required: [true, 'Please provide areas of expertise']
  },
  yearsOfExperience: {
    type: Number,
    required: [true, 'Please provide years of experience']
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  availability: {
    type: [AvailabilitySchema],
    default: []
  },
  profilePicture: {
    type: String
  },
  hourlyRate: {
    type: Number
  }
}, {
  timestamps: true
});

// Session schema for mentor sessions
const SessionSchema = new Schema<ISession>({
  mentorId: {
    type: Schema.Types.ObjectId,
    ref: 'Mentor',
    required: [true, 'Please provide a mentor ID']
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user ID']
  },
  date: {
    type: String,
    required: [true, 'Please provide a date']
  },
  startTime: {
    type: String,
    required: [true, 'Please provide a start time']
  },
  endTime: {
    type: String,
    required: [true, 'Please provide an end time']
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

export const Mentor = mongoose.model<IMentor>('Mentor', MentorSchema);
export const Session = mongoose.model<ISession>('Session', SessionSchema);
