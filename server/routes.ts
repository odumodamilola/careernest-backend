import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { authRouter } from "./controllers/auth.controller";
import { userRouter } from "./controllers/user.controller";
import { careerRouter } from "./controllers/career.controller";
import { mentorRouter } from "./controllers/mentor.controller";
import { assessmentRouter } from "./controllers/assessment.controller";
import { moduleRouter } from "./controllers/module.controller";
import cors from "cors";
import helmet from "helmet";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure middleware
  app.use(cors());
  app.use(helmet());

  // Setup authentication
  await setupAuth(app);

  // Register API routes
  app.use("/api/auth", authRouter);
  app.use("/api/users", userRouter);
  app.use("/api/careers", careerRouter);
  app.use("/api/mentors", mentorRouter);
  app.use("/api/assessments", assessmentRouter);
  app.use("/api/modules", moduleRouter);

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
