import { z } from "zod";
import { pgTable, serial, text, varchar, integer, timestamp, boolean, json, uniqueIndex, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// USER SCHEMA
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 50 }),
  lastName: varchar('last_name', { length: 50 }),
  bio: text('bio'),
  skills: json('skills').$type<string[]>(),
  interests: json('interests').$type<string[]>(),
  profilePicture: text('profile_picture'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// CAREER SCHEMA
export const careers = pgTable('careers', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 100 }).notNull(),
  description: text('description').notNull(),
  requirements: json('requirements').$type<string[]>().notNull(),
  salaryMin: integer('salary_min').notNull(),
  salaryMax: integer('salary_max').notNull(),
  salaryCurrency: varchar('salary_currency', { length: 3 }).default('USD'),
  skills: json('skills').$type<string[]>().notNull(),
  demand: varchar('demand', { length: 50 }),
  growthRate: integer('growth_rate'),
  categories: json('categories').$type<string[]>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// BOOKMARKED CAREERS TABLE FOR MANY-TO-MANY
export const bookmarkedCareers = pgTable('bookmarked_careers', {
  userId: integer('user_id').notNull().references(() => users.id),
  careerId: integer('career_id').notNull().references(() => careers.id),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.careerId] }),
}));

// MENTOR SCHEMA
export const mentors = pgTable('mentors', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  name: varchar('name', { length: 100 }).notNull(),
  title: varchar('title', { length: 100 }).notNull(),
  company: varchar('company', { length: 100 }).notNull(),
  bio: text('bio').notNull(),
  expertise: json('expertise').$type<string[]>().notNull(),
  yearsOfExperience: integer('years_of_experience').notNull(),
  rating: integer('rating'),
  availability: json('availability').$type<{
    day: string;
    startTime: string;
    endTime: string;
  }[]>(),
  profilePicture: text('profile_picture'),
  hourlyRate: integer('hourly_rate'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// SESSION SCHEMA
export const sessions = pgTable('mentorship_sessions', {
  id: serial('id').primaryKey(),
  mentorId: integer('mentor_id').notNull().references(() => mentors.id),
  userId: integer('user_id').notNull().references(() => users.id),
  date: varchar('date', { length: 50 }).notNull(),
  startTime: varchar('start_time', { length: 10 }).notNull(),
  endTime: varchar('end_time', { length: 10 }).notNull(),
  status: varchar('status', { length: 20 }).notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ASSESSMENT SCHEMAS
export const assessments = pgTable('assessments', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 100 }).notNull(),
  description: text('description').notNull(),
  timeLimit: integer('time_limit'),
  questions: json('questions').$type<{
    id: string;
    text: string;
    options: {
      id: string;
      text: string;
      isCorrect?: boolean;
    }[];
    type: 'multiple-choice' | 'true-false' | 'open-ended';
    points?: number;
  }[]>().notNull(),
  category: varchar('category', { length: 50 }),
  difficulty: varchar('difficulty', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ASSESSMENT RESULTS
export const assessmentResults = pgTable('assessment_results', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  assessmentId: integer('assessment_id').notNull().references(() => assessments.id),
  score: integer('score').notNull(),
  totalPoints: integer('total_points').notNull(),
  answers: json('answers').$type<{
    questionId: string;
    selectedOptionId?: string;
    openAnswer?: string;
    isCorrect?: boolean;
    points?: number;
  }[]>().notNull(),
  timeTaken: integer('time_taken'),
  completedAt: timestamp('completed_at').notNull(),
});

// LEARNING MODULE
export const modules = pgTable('modules', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 100 }).notNull(),
  description: text('description').notNull(),
  content: text('content').notNull(),
  estimatedTime: integer('estimated_time'),
  category: varchar('category', { length: 50 }),
  prerequisites: json('prerequisites').$type<string[]>(),
  resources: json('resources').$type<{
    title: string;
    url: string;
    type: 'video' | 'article' | 'ebook' | 'other';
  }[]>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// MODULE COMPLETION
export const moduleCompletions = pgTable('module_completions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  moduleId: integer('module_id').notNull().references(() => modules.id),
  completedAt: timestamp('completed_at').notNull(),
  feedback: text('feedback'),
  rating: integer('rating'),
}, (t) => ({
  // Prevent duplicate completions
  uniqueIndex: uniqueIndex('unique_user_module').on(t.userId, t.moduleId),
}));

// Postgres Session Storage Table (for express-session)
export const pgSessions = pgTable('pg_sessions', {
  sid: varchar('sid', { length: 255 }).primaryKey(),
  sess: json('sess').notNull(),
  expire: timestamp('expire').notNull(),
});

// Setup relations
export const usersRelations = relations(users, ({ many }) => ({
  bookmarkedCareers: many(bookmarkedCareers),
  sessions: many(sessions),
  assessmentResults: many(assessmentResults),
  moduleCompletions: many(moduleCompletions),
}));

export const careersRelations = relations(careers, ({ many }) => ({
  bookmarkedBy: many(bookmarkedCareers),
}));

export const mentorsRelations = relations(mentors, ({ many, one }) => ({
  user: one(users, {
    fields: [mentors.userId],
    references: [users.id],
  }),
  sessions: many(sessions),
}));

export const assessmentsRelations = relations(assessments, ({ many }) => ({
  results: many(assessmentResults),
}));

export const modulesRelations = relations(modules, ({ many }) => ({
  completions: many(moduleCompletions),
}));

// Validation Schemas
export const insertUserSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  profilePicture: z.string().optional(),
});

export const updateUserSchema = insertUserSchema.omit({ password: true }).partial();

export const loginSchema = z.object({
  login: z.string().min(1).describe('Username or Email'),
  password: z.string().min(1)
});

// Submit assessment schema
export const submitAssessmentSchema = z.object({
  assessmentId: z.number(),
  answers: z.array(z.object({
    questionId: z.string(),
    selectedOptionId: z.string().optional(),
    openAnswer: z.string().optional()
  }))
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type Login = z.infer<typeof loginSchema>;

export type Career = typeof careers.$inferSelect;
export type Mentor = typeof mentors.$inferSelect;
export type Session = typeof sessions.$inferSelect;

export type Assessment = typeof assessments.$inferSelect;
export type AssessmentResult = typeof assessmentResults.$inferSelect;
export type SubmitAssessment = z.infer<typeof submitAssessmentSchema>;

export type Module = typeof modules.$inferSelect;
export type ModuleCompletion = typeof moduleCompletions.$inferSelect;
