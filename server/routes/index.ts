import { Express } from 'express';
import { Server } from 'http';
import { db } from '../db';
import authRoutes from './auth';
import userRoutes from './users';

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Register API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);

  // Create HTTP server
  const server = new Server(app);
  return server;
}
