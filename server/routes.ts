import type { Express } from 'express';
import { createServer, type Server } from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
// Temporarily commenting out MongoDB connection
// import connectDB from './config/db';
import { setupAuth } from './auth';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import careerRoutes from './routes/careers';
import mentorRoutes from './routes/mentors';
import assessmentRoutes from './routes/assessments';
import moduleRoutes from './routes/modules';

// Load environment variables
dotenv.config();

export async function registerRoutes(app: Express): Promise<Server> {
  // Temporarily skip MongoDB connection to avoid timeout
  // await connectDB();
  console.log('Setting up application routes...');

  // Setup session storage and authentication
  setupAuth(app);

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: false // Disable for development
  }));
  
  // CORS for cross-origin requests (mobile app)
  app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  }));
  
  // API routes - prefix all with /api
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/careers', careerRoutes);
  app.use('/api/mentors', mentorRoutes);
  app.use('/api/assessments', assessmentRoutes);
  app.use('/api/modules', moduleRoutes);
  
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });
  
  // Error handling for non-existent API routes
  app.use('/api/*', (req, res) => {
    res.status(404).json({ message: 'API endpoint not found' });
  });

  const httpServer = createServer(app);

  return httpServer;
}
