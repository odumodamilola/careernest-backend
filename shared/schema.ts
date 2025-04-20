import { z } from "zod";

// User schemas
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  profileImage: z.string().optional()
});

export const userRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export const userLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});

export const userUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  profileImage: z.string().optional()
});

// Career schemas
export const careerSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  salary: z.object({
    min: z.number(),
    max: z.number(),
    currency: z.string().default("USD")
  }),
  skills: z.array(z.string()),
  education: z.string(),
  industry: z.string(),
  jobOutlook: z.string(),
  resources: z.array(z.object({
    title: z.string(),
    url: z.string()
  }))
});

// Mentor schemas
export const mentorSchema = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string(),
  company: z.string(),
  bio: z.string(),
  expertise: z.array(z.string()),
  yearsOfExperience: z.number(),
  profileImage: z.string().optional(),
  availability: z.array(z.object({
    day: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]),
    slots: z.array(z.object({
      startTime: z.string(),
      endTime: z.string(),
      isBooked: z.boolean().default(false)
    }))
  })),
  rating: z.number().default(0),
  reviewCount: z.number().default(0)
});

export const sessionSchema = z.object({
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  topic: z.string(),
  notes: z.string().optional()
});

// Assessment schemas
export const assessmentSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  timeLimit: z.number(),
  questions: z.array(z.object({
    id: z.string(),
    questionText: z.string(),
    options: z.array(z.object({
      id: z.string(),
      text: z.string(),
      isCorrect: z.boolean().optional() // Hidden in frontend
    })),
    explanation: z.string().optional()
  })),
  skillsAssessed: z.array(z.string()),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"])
});

export const assessmentSubmissionSchema = z.object({
  answers: z.array(z.object({
    questionId: z.string(),
    selectedOptions: z.array(z.string())
  }))
});

// Module schemas
export const moduleSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  duration: z.number(),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  content: z.array(z.object({
    title: z.string(),
    type: z.enum(["Video", "Article", "Quiz", "Exercise"]),
    data: z.any() // Could be URL, text content, quiz questions, etc.
  })),
  prerequisites: z.array(z.string()).optional(),
  outcomes: z.array(z.string()),
  author: z.object({
    name: z.string(),
    bio: z.string().optional()
  }),
  relatedCareers: z.array(z.string()).optional()
});

// Type exports
export type User = z.infer<typeof userSchema>;
export type UserRegister = z.infer<typeof userRegisterSchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;

export type Career = z.infer<typeof careerSchema>;
export type Mentor = z.infer<typeof mentorSchema>;
export type Session = z.infer<typeof sessionSchema>;
export type Assessment = z.infer<typeof assessmentSchema>;
export type AssessmentSubmission = z.infer<typeof assessmentSubmissionSchema>;
export type Module = z.infer<typeof moduleSchema>;
