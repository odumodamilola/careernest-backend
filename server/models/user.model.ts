import mongoose, { Schema, Document } from "mongoose";
import { User } from "@shared/schema";

export interface IUser extends User, Document {
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    default: ""
  },
  skills: [{
    type: String
  }],
  interests: [{
    type: String
  }],
  profileImage: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});

// Create index on email field for faster lookups
UserSchema.index({ email: 1 });

export default mongoose.model<IUser>("User", UserSchema);
