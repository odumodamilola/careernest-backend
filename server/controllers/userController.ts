import { Request, Response } from 'express';
import User from '../models/user';
import { updateUserSchema } from '@shared/schema';

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('bookmarkedCareers', 'title description');

    if (user) {
      res.json({
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
        skills: user.skills,
        interests: user.interests,
        profilePicture: user.profilePicture,
        bookmarkedCareers: user.bookmarkedCareers
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      message: 'Error retrieving user profile',
      error: error.message 
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields if provided
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.bio = req.body.bio || user.bio;
    user.skills = req.body.skills || user.skills;
    user.interests = req.body.interests || user.interests;
    user.profilePicture = req.body.profilePicture || user.profilePicture;

    // If password included, it will trigger the pre-save hook to hash it
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      bio: updatedUser.bio,
      skills: updatedUser.skills,
      interests: updatedUser.interests,
      profilePicture: updatedUser.profilePicture
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      message: 'Error updating user profile',
      error: error.message 
    });
  }
};
