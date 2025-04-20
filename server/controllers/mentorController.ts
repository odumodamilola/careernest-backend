import { Request, Response } from 'express';
import { Mentor, Session } from '../models/mentor';
import mongoose from 'mongoose';

// @desc    Get all mentors
// @route   GET /api/mentors
// @access  Private
export const getMentors = async (req: Request, res: Response) => {
  try {
    // Support for pagination and filtering
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Filter by expertise if provided
    const filter: any = {};
    if (req.query.expertise) {
      filter.expertise = req.query.expertise;
    }
    
    // Get total count for pagination
    const total = await Mentor.countDocuments(filter);
    
    // Fetch mentors with pagination
    const mentors = await Mentor.find(filter)
      .sort({ rating: -1 })
      .skip(skip)
      .limit(limit);
    
    res.json({
      mentors,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error: any) {
    console.error('Get mentors error:', error);
    res.status(500).json({ 
      message: 'Error retrieving mentors',
      error: error.message 
    });
  }
};

// @desc    Get mentor by ID
// @route   GET /api/mentors/:id
// @access  Private
export const getMentorById = async (req: Request, res: Response) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }
    
    res.json(mentor);
  } catch (error: any) {
    console.error('Get mentor error:', error);
    res.status(500).json({ 
      message: 'Error retrieving mentor',
      error: error.message 
    });
  }
};

// @desc    Schedule a mentorship session
// @route   POST /api/mentors/schedule/:id
// @access  Private
export const scheduleSession = async (req: Request, res: Response) => {
  try {
    const mentorId = req.params.id;
    const userId = req.user._id;
    
    // Validate mentor exists
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }
    
    const { date, startTime, endTime, notes } = req.body;
    
    // Validate required fields
    if (!date || !startTime || !endTime) {
      return res.status(400).json({ 
        message: 'Please provide date, start time, and end time' 
      });
    }
    
    // Check mentor availability
    // Here you would check if the mentor is available at the requested time
    // This is a simplified version
    
    // Create new session
    const session = await Session.create({
      mentorId,
      userId,
      date,
      startTime,
      endTime,
      notes: notes || '',
      status: 'scheduled'
    });
    
    res.status(201).json(session);
  } catch (error: any) {
    console.error('Schedule session error:', error);
    res.status(500).json({ 
      message: 'Error scheduling session',
      error: error.message 
    });
  }
};

// Helper function to get user's sessions
export const getUserSessions = async (userId: string) => {
  return await Session.find({ userId })
    .populate('mentorId', 'name title company profilePicture')
    .sort({ date: 1, startTime: 1 });
};
