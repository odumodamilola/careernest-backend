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
// We're using auth routes from setupAuth, skip authRoutes
// import authRoutes from './routes/auth';
// import userRoutes from './routes/users';
// import careerRoutes from './routes/careers';
// import mentorRoutes from './routes/mentors';
// import assessmentRoutes from './routes/assessments';
// import moduleRoutes from './routes/modules';

// Load environment variables
dotenv.config();

export async function registerRoutes(app: Express): Promise<Server> {
  // Temporarily skip MongoDB connection to avoid timeout
  // await connectDB();
  console.log('Setting up application routes...');

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: false // Disable for development
  }));
  
  // CORS for cross-origin requests (mobile app)
  app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  }));

  // Setup session storage and authentication
  // This also adds auth routes (/api/register, /api/login, /api/logout, /api/user)
  setupAuth(app);
  
  // Skip MongoDB-based routes for now
  // app.use('/api/auth', authRoutes);
  // app.use('/api/users', userRoutes);
  // app.use('/api/careers', careerRoutes);
  // app.use('/api/mentors', mentorRoutes);
  // app.use('/api/assessments', assessmentRoutes);
  // app.use('/api/modules', moduleRoutes);
  
  // Mock routes for API endpoints (to avoid MongoDB timeouts)
  // Career paths endpoint
  app.get('/api/careers', (req, res) => {
    res.json([
      { id: '1', title: 'Full Stack Developer', description: 'Build web applications from front to back' },
      { id: '2', title: 'Data Scientist', description: 'Analyze and interpret complex data' },
      { id: '3', title: 'DevOps Engineer', description: 'Combine development and operations' }
    ]);
  });

  // Mentors endpoint
  app.get('/api/mentors', (req, res) => {
    res.json([
      { id: '1', name: 'John Doe', title: 'Senior Developer', company: 'TechCorp' },
      { id: '2', name: 'Jane Smith', title: 'Data Science Lead', company: 'DataTech' }
    ]);
  });

  // Assessments endpoint
  app.get('/api/assessments', (req, res) => {
    res.json([
      { id: '1', title: 'JavaScript Skills', description: 'Test your JavaScript knowledge' },
      { id: '2', title: 'Data Analysis', description: 'Evaluate your data analysis capabilities' }
    ]);
  });

  // Learning modules endpoint
  app.get('/api/modules', (req, res) => {
    res.json([
      { id: '1', title: 'JavaScript Fundamentals', description: 'Learn the basics of JavaScript' },
      { id: '2', title: 'Python for Data Science', description: 'Master Python for data analysis' }
    ]);
  });
  
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
