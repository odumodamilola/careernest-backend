import { Request, Response } from 'express';
import Career from '../models/career';
import User from '../models/user';
import mongoose from 'mongoose';

// @desc    Get all careers
// @route   GET /api/careers
// @access  Private
export const getCareers = async (req: Request, res: Response) => {
  try {
    // Support for pagination and filtering
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Filter by category if provided
    const filter: any = {};
    if (req.query.category) {
      filter.categories = req.query.category;
    }
    
    // Get total count for pagination
    const total = await Career.countDocuments(filter);
    
    // Fetch careers with pagination
    const careers = await Career.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.json({
      careers,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error: any) {
    console.error('Get careers error:', error);
    res.status(500).json({ 
      message: 'Error retrieving careers',
      error: error.message 
    });
  }
};

// @desc    Get career by ID
// @route   GET /api/careers/:id
// @access  Private
export const getCareerById = async (req: Request, res: Response) => {
  try {
    const career = await Career.findById(req.params.id);
    
    if (career) {
      res.json(career);
    } else {
      res.status(404).json({ message: 'Career not found' });
    }
  } catch (error: any) {
    console.error('Get career error:', error);
    res.status(500).json({ 
      message: 'Error retrieving career',
      error: error.message 
    });
  }
};

// @desc    Bookmark a career
// @route   POST /api/careers/bookmark/:id
// @access  Private
export const bookmarkCareer = async (req: Request, res: Response) => {
  try {
    const careerId = req.params.id;
    const userId = req.user._id;
    
    // Check if career exists
    const career = await Career.findById(careerId);
    if (!career) {
      return res.status(404).json({ message: 'Career not found' });
    }
    
    // Check if user already bookmarked this career
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if career is already bookmarked
    const isBookmarked = user.bookmarkedCareers.some(
      (bookmarkedId) => bookmarkedId.toString() === careerId
    );
    
    if (isBookmarked) {
      // Remove bookmark if already bookmarked
      user.bookmarkedCareers = user.bookmarkedCareers.filter(
        (bookmarkedId) => bookmarkedId.toString() !== careerId
      );
      await user.save();
      
      res.json({ 
        message: 'Career removed from bookmarks', 
        isBookmarked: false 
      });
    } else {
      // Add career to bookmarks
      user.bookmarkedCareers.push(new mongoose.Types.ObjectId(careerId));
      await user.save();
      
      res.json({ 
        message: 'Career bookmarked successfully', 
        isBookmarked: true 
      });
    }
  } catch (error: any) {
    console.error('Bookmark career error:', error);
    res.status(500).json({ 
      message: 'Error bookmarking career',
      error: error.message 
    });
  }
};

// @desc    Get user's bookmarked careers
// @route   GET /api/careers/bookmarks
// @access  Private
export const getBookmarkedCareers = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    
    const user = await User.findById(userId)
      .populate('bookmarkedCareers');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.bookmarkedCareers);
  } catch (error: any) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({ 
      message: 'Error retrieving bookmarked careers',
      error: error.message 
    });
  }
};
