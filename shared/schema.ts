import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  bio: text("bio"),
  skills: text("skills").array(),
  interests: text("interests").array(),
  profilePicture: text("profile_picture"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

// Career schema
export const careers = pgTable("careers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  averageSalary: text("average_salary"),
  requirements: text("requirements").array(),
  skills: text("skills").array(),
  industries: text("industries").array(),
  jobOutlook: text("job_outlook"),
});

export const insertCareerSchema = createInsertSchema(careers).omit({
  id: true,
});

// Career bookmark schema
export const careerBookmarks = pgTable("career_bookmarks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  careerId: integer("career_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCareerBookmarkSchema = createInsertSchema(careerBookmarks).omit({
  id: true,
  createdAt: true,
});

// Mentor schema
export const mentors = pgTable("mentors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"), // Optional link to users table if mentor is also a user
  name: text("name").notNull(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  bio: text("bio").notNull(),
  expertise: text("expertise").array(),
  yearsOfExperience: integer("years_of_experience").notNull(),
  rating: integer("rating"),
  profilePicture: text("profile_picture"),
  availability: json("availability"), // JSON structure for availability
});

export const insertMentorSchema = createInsertSchema(mentors).omit({
  id: true,
});

// Mentorship session schema
export const mentorshipSessions = pgTable("mentorship_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  mentorId: integer("mentor_id").notNull(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  duration: integer("duration").notNull(), // in minutes
  meetingPlatform: text("meeting_platform").notNull(),
  meetingLink: text("meeting_link"),
  status: text("status").notNull(), // scheduled, completed, cancelled
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMentorshipSessionSchema = createInsertSchema(mentorshipSessions).omit({
  id: true,
  createdAt: true,
});

// Assessment schema
export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  timeLimit: integer("time_limit"), // in minutes
  questions: json("questions").notNull(), // JSON array of questions
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
});

// Assessment result schema
export const assessmentResults = pgTable("assessment_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  assessmentId: integer("assessment_id").notNull(),
  score: integer("score").notNull(),
  answers: json("answers").notNull(), // JSON of user answers
  feedback: json("feedback"), // JSON of feedback per question
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

export const insertAssessmentResultSchema = createInsertSchema(assessmentResults).omit({
  id: true,
  completedAt: true,
});

// Learning module schema
export const learningModules = pgTable("learning_modules", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  content: json("content").notNull(), // JSON structure of module content
  estimatedDuration: integer("estimated_duration").notNull(), // in minutes
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  prerequisites: text("prerequisites").array(),
  skills: text("skills").array(),
});

export const insertLearningModuleSchema = createInsertSchema(learningModules).omit({
  id: true,
});

// Module completion schema
export const moduleCompletions = pgTable("module_completions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  moduleId: integer("module_id").notNull(),
  progress: integer("progress").notNull(), // percentage completed
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  lastActivityAt: timestamp("last_activity_at").defaultNow().notNull(),
});

export const insertModuleCompletionSchema = createInsertSchema(moduleCompletions).omit({
  id: true,
  completedAt: true,
  lastActivityAt: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCareer = z.infer<typeof insertCareerSchema>;
export type Career = typeof careers.$inferSelect;

export type InsertCareerBookmark = z.infer<typeof insertCareerBookmarkSchema>;
export type CareerBookmark = typeof careerBookmarks.$inferSelect;

export type InsertMentor = z.infer<typeof insertMentorSchema>;
export type Mentor = typeof mentors.$inferSelect;

export type InsertMentorshipSession = z.infer<typeof insertMentorshipSessionSchema>;
export type MentorshipSession = typeof mentorshipSessions.$inferSelect;

export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessments.$inferSelect;

export type InsertAssessmentResult = z.infer<typeof insertAssessmentResultSchema>;
export type AssessmentResult = typeof assessmentResults.$inferSelect;

export type InsertLearningModule = z.infer<typeof insertLearningModuleSchema>;
export type LearningModule = typeof learningModules.$inferSelect;

export type InsertModuleCompletion = z.infer<typeof insertModuleCompletionSchema>;
export type ModuleCompletion = typeof moduleCompletions.$inferSelect;
