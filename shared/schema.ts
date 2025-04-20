import { z } from "zod";

// USER SCHEMAS
export const userSchema = z.object({
  id: z.string(),
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  profilePicture: z.string().optional(),
  bookmarkedCareers: z.array(z.string()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const insertUserSchema = userSchema.omit({ 
  id: true, 
  bookmarkedCareers: true,
  createdAt: true,
  updatedAt: true
});

export const updateUserSchema = userSchema.omit({ 
  id: true, 
  password: true,
  createdAt: true,
  updatedAt: true
}).partial();

export const loginSchema = z.object({
  username: z.string(),
  password: z.string()
});

// CAREER SCHEMAS
export const careerSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  requirements: z.array(z.string()),
  salary: z.object({
    min: z.number(),
    max: z.number(),
    currency: z.string().default("USD")
  }),
  skills: z.array(z.string()),
  demand: z.string().optional(),
  growthRate: z.number().optional(),
  categories: z.array(z.string()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// MENTOR SCHEMAS
export const mentorSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  name: z.string(),
  title: z.string(),
  company: z.string(),
  bio: z.string(),
  expertise: z.array(z.string()),
  yearsOfExperience: z.number(),
  rating: z.number().optional(),
  availability: z.array(z.object({
    day: z.string(),
    startTime: z.string(),
    endTime: z.string()
  })).optional(),
  profilePicture: z.string().optional(),
  hourlyRate: z.number().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const sessionSchema = z.object({
  id: z.string(),
  mentorId: z.string(),
  userId: z.string(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  status: z.enum(["scheduled", "completed", "cancelled"]),
  notes: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// ASSESSMENT SCHEMAS
export const questionSchema = z.object({
  id: z.string(),
  text: z.string(),
  options: z.array(z.object({
    id: z.string(),
    text: z.string(),
    isCorrect: z.boolean().optional()
  })),
  type: z.enum(["multiple-choice", "true-false", "open-ended"]),
  points: z.number().optional(),
});

export const assessmentSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  timeLimit: z.number().optional(),
  questions: z.array(questionSchema),
  category: z.string().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const assessmentResultSchema = z.object({
  id: z.string(),
  userId: z.string(),
  assessmentId: z.string(),
  score: z.number(),
  totalPoints: z.number(),
  answers: z.array(z.object({
    questionId: z.string(),
    selectedOptionId: z.string().optional(),
    openAnswer: z.string().optional(),
    isCorrect: z.boolean().optional(),
    points: z.number().optional()
  })),
  timeTaken: z.number().optional(),
  completedAt: z.date(),
});

export const submitAssessmentSchema = z.object({
  assessmentId: z.string(),
  answers: z.array(z.object({
    questionId: z.string(),
    selectedOptionId: z.string().optional(),
    openAnswer: z.string().optional()
  }))
});

// LEARNING MODULE SCHEMAS
export const moduleSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  content: z.string(),
  estimatedTime: z.number().optional(),
  category: z.string().optional(),
  prerequisites: z.array(z.string()).optional(),
  resources: z.array(z.object({
    title: z.string(),
    url: z.string(),
    type: z.enum(["video", "article", "ebook", "other"])
  })).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const moduleCompletionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  moduleId: z.string(),
  completedAt: z.date(),
  feedback: z.string().optional(),
  rating: z.number().optional(),
});

// Types
export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type Login = z.infer<typeof loginSchema>;

export type Career = z.infer<typeof careerSchema>;
export type Mentor = z.infer<typeof mentorSchema>;
export type Session = z.infer<typeof sessionSchema>;

export type Question = z.infer<typeof questionSchema>;
export type Assessment = z.infer<typeof assessmentSchema>;
export type AssessmentResult = z.infer<typeof assessmentResultSchema>;
export type SubmitAssessment = z.infer<typeof submitAssessmentSchema>;

export type Module = z.infer<typeof moduleSchema>;
export type ModuleCompletion = z.infer<typeof moduleCompletionSchema>;
