import { Request, Response } from 'express';
import { db } from '../db';
import { users } from '@shared/schema';
import { generateToken } from '../middleware/auth';
import { eq, or } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  try {
    console.log('Register request body:', req.body);
    const { username, email, password } = req.body;

    // Check if user already exists with username
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (existingUser.length > 0) {
      return res.status(400).json({ 
        message: 'Username already exists'
      });
    }

    // Check if email exists
    const existingEmail = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingEmail.length > 0) {
      return res.status(400).json({ 
        message: 'Email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const [user] = await db.insert(users)
      .values({
        username,
        email,
        password: hashedPassword,
        firstName: req.body.firstName || null,
        lastName: req.body.lastName || null,
        bio: req.body.bio || null,
        skills: req.body.skills || [],
        interests: req.body.interests || [],
        profilePicture: req.body.profilePicture || null,
      })
      .returning();

    if (user) {
      // Return user info with token
      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        token: generateToken(user.id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
  try {
    // Debug logging
    console.log('Login request:', {
      body: req.body,
      contentType: req.headers['content-type'],
      method: req.method
    });

    // Check if body is empty
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ 
        message: 'Request body is empty',
        received: req.body
      });
    }

    const { login, password } = req.body;

    // More specific error message
    if (!login || !password) {
      return res.status(400).json({ 
        message: 'Please provide both login (username or email) and password',
        received: {
          hasLogin: !!login,
          hasPassword: !!password,
          body: req.body
        }
      });
    }

    // Find user by username or email
    const user = await db
      .select()
      .from(users)
      .where(or(
        eq(users.username, login),
        eq(users.email, login)
      ))
      .limit(1);

    if (user.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Return user info with token
    res.json({
      id: user[0].id,
      username: user[0].username,
      email: user[0].email,
      firstName: user[0].firstName,
      lastName: user[0].lastName,
      token: generateToken(user[0].id)
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = async (req: Request, res: Response) => {
  try {
    // Since we're using JWT, we don't need to do anything server-side
    // The client should remove the token from storage
    res.json({ message: 'Logged out successfully' });
  } catch (error: any) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
