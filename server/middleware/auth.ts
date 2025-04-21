import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';

// Define the User type
export type User = {
  id: number;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  skills: string[] | null;
  interests: string[] | null;
  profilePicture: string | null;
  password: string;
  createdAt: Date | null;
  updatedAt: Date | null;
};

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
      token?: string;
    }
  }
}

// Get JWT secret from environment variables or use a default for development
const JWT_SECRET = process.env.JWT_SECRET || 'careernest_jwt_secret';

// Middleware to verify JWT token and protect routes
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  // Get token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded: any = jwt.verify(token, JWT_SECRET);

      // Find user by id (exclude password)
      const user = await db.select({
        id: users.id,
        username: users.username,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        bio: users.bio,
        skills: users.skills,
        interests: users.interests,
        profilePicture: users.profilePicture,
        password: users.password,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, decoded.id))
      .limit(1);

      if (!user || user.length === 0) {
        throw new Error('User not found');
      }

      req.user = user[0];
      req.token = token;
      
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }
};

// Generate JWT Token
export const generateToken = (id: number): string => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d' // Token expires in 30 days
  });
};
