import { Request, Response } from 'express';
import User from '../models/user';
import { generateToken } from '../middleware/auth';
import { insertUserSchema, loginSchema } from '@shared/schema';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (userExists) {
      return res.status(400).json({ 
        message: 'User already exists with this email or username' 
      });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      // Include other fields from request body as needed
      firstName: req.body.firstName || '',
      lastName: req.body.lastName || '',
      bio: req.body.bio || '',
      skills: req.body.skills || [],
      interests: req.body.interests || []
    });

    if (user) {
      // Return user info with token
      res.status(201).json({
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({ 
      message: 'Server error during registration',
      error: error.message 
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Find user by username or email
    const user = await User.findOne({ 
      $or: [{ username }, { email: username }]
    }).select('+password'); // Include password for comparison

    // Check if user exists and password matches
    if (user && (await user.comparePassword(password))) {
      res.json({
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login',
      error: error.message 
    });
  }
};

// @desc    Logout user / clear token
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = async (req: Request, res: Response) => {
  try {
    // In JWT auth, logout is handled client-side by removing the token
    // Here we just return a success response
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error: any) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      message: 'Server error during logout',
      error: error.message 
    });
  }
};
