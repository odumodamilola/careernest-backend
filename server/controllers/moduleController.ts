import { Request, Response } from 'express';
import { Module, ModuleCompletion } from '../models/module';
import mongoose from 'mongoose';

// @desc    Get all learning modules
// @route   GET /api/modules
// @access  Private
export const getModules = async (req: Request, res: Response) => {
  try {
    // Support for pagination and filtering
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Filter by category if provided
    const filter: any = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    // Get total count for pagination
    const total = await Module.countDocuments(filter);
    
    // Fetch modules with pagination
    const modules = await Module.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // If user is authenticated, check which modules they've completed
    const userId = req.user._id;
    const completedModules = await ModuleCompletion.find({ userId })
      .distinct('moduleId');
    
    // Add completion status to modules
    const modulesWithStatus = modules.map(module => {
      const isCompleted = completedModules.some(
        id => id.toString() === module._id.toString()
      );
      
      return {
        ...module.toObject(),
        isCompleted
      };
    });
    
    res.json({
      modules: modulesWithStatus,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error: any) {
    console.error('Get modules error:', error);
    res.status(500).json({ 
      message: 'Error retrieving modules',
      error: error.message 
    });
  }
};

// @desc    Get module by ID
// @route   GET /api/modules/:id
// @access  Private
export const getModuleById = async (req: Request, res: Response) => {
  try {
    const module = await Module.findById(req.params.id);
    
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    // Check if user has completed this module
    const userId = req.user._id;
    const completion = await ModuleCompletion.findOne({
      userId,
      moduleId: module._id
    });
    
    const moduleWithStatus = {
      ...module.toObject(),
      isCompleted: !!completion,
      completedAt: completion ? completion.completedAt : null,
      userRating: completion ? completion.rating : null
    };
    
    res.json(moduleWithStatus);
  } catch (error: any) {
    console.error('Get module error:', error);
    res.status(500).json({ 
      message: 'Error retrieving module',
      error: error.message 
    });
  }
};

// @desc    Mark a module as completed
// @route   POST /api/modules/:id/complete
// @access  Private
export const completeModule = async (req: Request, res: Response) => {
  try {
    const moduleId = req.params.id;
    const userId = req.user._id;
    const { feedback, rating } = req.body;
    
    // Check if module exists
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    // Check if already completed
    const existingCompletion = await ModuleCompletion.findOne({
      userId,
      moduleId
    });
    
    if (existingCompletion) {
      // Update existing completion with new feedback/rating
      existingCompletion.feedback = feedback || existingCompletion.feedback;
      existingCompletion.rating = rating || existingCompletion.rating;
      await existingCompletion.save();
      
      return res.json({
        message: 'Module completion updated',
        completion: existingCompletion
      });
    }
    
    // Create new completion record
    const completion = await ModuleCompletion.create({
      userId,
      moduleId,
      completedAt: new Date(),
      feedback,
      rating
    });
    
    res.status(201).json({
      message: 'Module marked as completed',
      completion
    });
  } catch (error: any) {
    console.error('Complete module error:', error);
    res.status(500).json({ 
      message: 'Error marking module as completed',
      error: error.message 
    });
  }
};
