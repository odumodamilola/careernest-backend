import { IStorage } from "./storage.interface";
import UserModel, { IUser } from "./models/user.model";
import CareerModel, { ICareer } from "./models/career.model";
import MentorModel, { IMentor } from "./models/mentor.model";
import AssessmentModel, { IAssessment } from "./models/assessment.model";
import ModuleModel, { IModule } from "./models/module.model";
import { User, Career, Mentor, Assessment, Module } from "@shared/schema";
import session from "express-session";
import { connectDB } from "./config/db";
import mongoose from "mongoose";
import memorystore from "memorystore";

// Create memory session store
const MemoryStore = memorystore(session);

// Create additional models for relationships
const BookmarkModel = mongoose.model("Bookmark", new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  careerId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}));

const SessionModel = mongoose.model("Session", new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  mentorId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  status: {
    type: String,
    enum: ["Scheduled", "Completed", "Cancelled"],
    default: "Scheduled"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}));

const AssessmentResultModel = mongoose.model("AssessmentResult", new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  assessmentId: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  answers: [{
    questionId: {
      type: String,
      required: true
    },
    selectedOptions: [{
      type: String,
      required: true
    }],
    isCorrect: {
      type: Boolean,
      required: true
    }
  }],
  completedAt: {
    type: Date,
    default: Date.now
  }
}));

const CompletedModuleModel = mongoose.model("CompletedModule", new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  moduleId: {
    type: String,
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}));

export class MongoDBStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    // Connect to MongoDB
    connectDB();

    // Initialize session store
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // Prune expired entries every 24h
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    try {
      const user = await UserModel.findById(id).lean();
      return user ? user as User : undefined;
    } catch (error) {
      console.error("Get user error:", error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const user = await UserModel.findOne({ email }).lean();
      return user ? user as User : undefined;
    } catch (error) {
      console.error("Get user by email error:", error);
      return undefined;
    }
  }

  async createUser(userData: Omit<User, "id">): Promise<User> {
    try {
      const user = await UserModel.create(userData);
      return user.toObject() as User;
    } catch (error) {
      console.error("Create user error:", error);
      throw error;
    }
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User | undefined> {
    try {
      const user = await UserModel.findByIdAndUpdate(
        id,
        { $set: userData },
        { new: true, runValidators: true }
      ).lean();
      
      return user ? user as User : undefined;
    } catch (error) {
      console.error("Update user error:", error);
      return undefined;
    }
  }

  // Career methods
  async getAllCareers(): Promise<Career[]> {
    try {
      const careers = await CareerModel.find().lean();
      return careers as Career[];
    } catch (error) {
      console.error("Get all careers error:", error);
      return [];
    }
  }

  async getCareer(id: string): Promise<Career | undefined> {
    try {
      const career = await CareerModel.findById(id).lean();
      return career ? career as Career : undefined;
    } catch (error) {
      console.error("Get career error:", error);
      return undefined;
    }
  }

  async bookmarkCareer(userId: string, careerId: string): Promise<{ success: boolean }> {
    try {
      // Check if bookmark already exists
      const existingBookmark = await BookmarkModel.findOne({ userId, careerId });
      
      if (existingBookmark) {
        // Remove bookmark if it exists (toggle functionality)
        await BookmarkModel.deleteOne({ userId, careerId });
        return { success: true };
      }

      // Create new bookmark
      await BookmarkModel.create({ userId, careerId });
      return { success: true };
    } catch (error) {
      console.error("Bookmark career error:", error);
      throw error;
    }
  }

  async getUserBookmarks(userId: string): Promise<Career[]> {
    try {
      // Get all bookmarks for user
      const bookmarks = await BookmarkModel.find({ userId }).lean();
      
      // Get career IDs from bookmarks
      const careerIds = bookmarks.map(bookmark => bookmark.careerId);
      
      // Get career details for each bookmark
      const careers = await CareerModel.find({ _id: { $in: careerIds } }).lean();
      
      return careers as Career[];
    } catch (error) {
      console.error("Get user bookmarks error:", error);
      return [];
    }
  }

  // Mentor methods
  async getAllMentors(): Promise<Mentor[]> {
    try {
      const mentors = await MentorModel.find().lean();
      return mentors as Mentor[];
    } catch (error) {
      console.error("Get all mentors error:", error);
      return [];
    }
  }

  async getMentor(id: string): Promise<Mentor | undefined> {
    try {
      const mentor = await MentorModel.findById(id).lean();
      return mentor ? mentor as Mentor : undefined;
    } catch (error) {
      console.error("Get mentor error:", error);
      return undefined;
    }
  }

  async scheduleSession(userId: string, mentorId: string, sessionData: any): Promise<any> {
    try {
      // Create session
      const session = await SessionModel.create({
        userId,
        mentorId,
        ...sessionData
      });

      return session.toObject();
    } catch (error) {
      console.error("Schedule session error:", error);
      throw error;
    }
  }

  // Assessment methods
  async getAllAssessments(): Promise<Assessment[]> {
    try {
      // Get assessments without questions for list view
      const assessments = await AssessmentModel.find()
        .select("-questions.options.isCorrect")
        .lean();
      
      return assessments as Assessment[];
    } catch (error) {
      console.error("Get all assessments error:", error);
      return [];
    }
  }

  async getAssessment(id: string): Promise<Assessment | undefined> {
    try {
      const assessment = await AssessmentModel.findById(id)
        .select("-questions.options.isCorrect")
        .lean();
      
      return assessment ? assessment as Assessment : undefined;
    } catch (error) {
      console.error("Get assessment error:", error);
      return undefined;
    }
  }

  async submitAssessment(userId: string, assessmentId: string, answers: any): Promise<any> {
    try {
      // Get assessment with correct answers
      const assessment = await AssessmentModel.findById(assessmentId).lean();
      if (!assessment) {
        throw new Error("Assessment not found");
      }

      let score = 0;
      let correctAnswers = 0;
      const processedAnswers = [];

      // Process answers and calculate score
      for (const answer of answers.answers) {
        const question = assessment.questions.find(q => q._id.toString() === answer.questionId);
        if (!question) continue;

        // Check if answer is correct
        const correctOptions = question.options.filter(o => o.isCorrect).map(o => o._id.toString());
        const isCorrect = answer.selectedOptions.length === correctOptions.length &&
          answer.selectedOptions.every(option => correctOptions.includes(option));

        if (isCorrect) {
          correctAnswers++;
          score += 1;
        }

        processedAnswers.push({
          questionId: answer.questionId,
          selectedOptions: answer.selectedOptions,
          isCorrect
        });
      }

      // Calculate percentage score
      const totalQuestions = assessment.questions.length;
      const percentageScore = (score / totalQuestions) * 100;

      // Save assessment result
      const result = await AssessmentResultModel.create({
        userId,
        assessmentId,
        score: percentageScore,
        totalQuestions,
        correctAnswers,
        answers: processedAnswers
      });

      return {
        score: percentageScore,
        totalQuestions,
        correctAnswers,
        assessmentId,
        assessmentTitle: assessment.title
      };
    } catch (error) {
      console.error("Submit assessment error:", error);
      throw error;
    }
  }

  async getUserAssessmentResults(userId: string): Promise<any[]> {
    try {
      // Get all assessment results for user
      const results = await AssessmentResultModel.find({ userId }).lean();
      
      // Get assessment titles
      const assessmentIds = results.map(result => result.assessmentId);
      const assessments = await AssessmentModel.find({ _id: { $in: assessmentIds } })
        .select("title category")
        .lean();
      
      // Map assessment titles to results
      const resultsWithTitles = results.map(result => {
        const assessment = assessments.find(a => a._id.toString() === result.assessmentId);
        return {
          ...result,
          assessmentTitle: assessment ? assessment.title : "Unknown Assessment",
          category: assessment ? assessment.category : "Unknown Category"
        };
      });
      
      return resultsWithTitles;
    } catch (error) {
      console.error("Get user assessment results error:", error);
      return [];
    }
  }

  // Module methods
  async getAllModules(): Promise<Module[]> {
    try {
      const modules = await ModuleModel.find().lean();
      return modules as Module[];
    } catch (error) {
      console.error("Get all modules error:", error);
      return [];
    }
  }

  async getModule(id: string): Promise<Module | undefined> {
    try {
      const module = await ModuleModel.findById(id).lean();
      return module ? module as Module : undefined;
    } catch (error) {
      console.error("Get module error:", error);
      return undefined;
    }
  }

  async completeModule(userId: string, moduleId: string): Promise<{ success: boolean }> {
    try {
      // Check if already completed
      const existingCompletion = await CompletedModuleModel.findOne({ userId, moduleId });
      
      if (existingCompletion) {
        return { success: true };
      }

      // Mark as completed
      await CompletedModuleModel.create({ userId, moduleId });
      return { success: true };
    } catch (error) {
      console.error("Complete module error:", error);
      throw error;
    }
  }
}

// Create interface file to separate types
export interface IStorage {
  sessionStore: session.Store;
  
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(userData: Omit<User, "id">): Promise<User>;
  updateUser(id: string, userData: Partial<User>): Promise<User | undefined>;
  
  // Career methods
  getAllCareers(): Promise<Career[]>;
  getCareer(id: string): Promise<Career | undefined>;
  bookmarkCareer(userId: string, careerId: string): Promise<{ success: boolean }>;
  getUserBookmarks(userId: string): Promise<Career[]>;
  
  // Mentor methods
  getAllMentors(): Promise<Mentor[]>;
  getMentor(id: string): Promise<Mentor | undefined>;
  scheduleSession(userId: string, mentorId: string, sessionData: any): Promise<any>;
  
  // Assessment methods
  getAllAssessments(): Promise<Assessment[]>;
  getAssessment(id: string): Promise<Assessment | undefined>;
  submitAssessment(userId: string, assessmentId: string, answers: any): Promise<any>;
  getUserAssessmentResults(userId: string): Promise<any[]>;
  
  // Module methods
  getAllModules(): Promise<Module[]>;
  getModule(id: string): Promise<Module | undefined>;
  completeModule(userId: string, moduleId: string): Promise<{ success: boolean }>;
}

// Export an instance of the MongoDB storage
export const storage = new MongoDBStorage();
