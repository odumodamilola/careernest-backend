import { Request, Response } from 'express';
import { db } from '../db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { User } from '../middleware/auth';

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        bio: users.bio,
        skills: users.skills,
        interests: users.interests,
        profilePicture: users.profilePicture,
      })
      .from(users)
      .where(eq(users.id, req.user.id))
      .limit(1);

    if (user && user.length > 0) {
      res.json(user[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const [user] = await db
      .update(users)
      .set({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        bio: req.body.bio,
        skills: req.body.skills,
        interests: req.body.interests,
        profilePicture: req.body.profilePicture,
      })
      .where(eq(users.id, req.user.id))
      .returning();

    if (user) {
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
        skills: user.skills,
        interests: user.interests,
        profilePicture: user.profilePicture,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
