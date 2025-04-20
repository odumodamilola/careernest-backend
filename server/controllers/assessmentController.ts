import { Request, Response } from 'express';
import { Assessment, AssessmentResult } from '../models/assessment';
import mongoose from 'mongoose';

// @desc    Get all assessments
// @route   GET /api/assessments
// @access  Private
export const getAssessments = async (req: Request, res: Response) => {
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
    const total = await Assessment.countDocuments(filter);
    
    // Fetch assessments with pagination, excluding questions
    const assessments = await Assessment.find(filter)
      .select('-questions.options.isCorrect') // Hide correct answers
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.json({
      assessments,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error: any) {
    console.error('Get assessments error:', error);
    res.status(500).json({ 
      message: 'Error retrieving assessments',
      error: error.message 
    });
  }
};

// @desc    Get assessment by ID
// @route   GET /api/assessments/:id
// @access  Private
export const getAssessmentById = async (req: Request, res: Response) => {
  try {
    // Fetch assessment without showing correct answers
    const assessment = await Assessment.findById(req.params.id)
      .select('-questions.options.isCorrect');
    
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    
    res.json(assessment);
  } catch (error: any) {
    console.error('Get assessment error:', error);
    res.status(500).json({ 
      message: 'Error retrieving assessment',
      error: error.message 
    });
  }
};

// @desc    Submit assessment answers
// @route   POST /api/assessments/:id/submit
// @access  Private
export const submitAssessment = async (req: Request, res: Response) => {
  try {
    const assessmentId = req.params.id;
    const userId = req.user._id;
    const { answers, timeTaken } = req.body;
    
    // Validate assessment exists
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    
    // Validate answers format
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Invalid answers format' });
    }
    
    // Grade the assessment
    let score = 0;
    let totalPoints = 0;
    
    const gradedAnswers = answers.map((answer: any) => {
      const question = assessment.questions.find(q => q.id === answer.questionId);
      
      if (!question) {
        return { ...answer, isCorrect: false, points: 0 };
      }
      
      totalPoints += question.points || 1;
      
      // Different grading logic based on question type
      if (question.type === 'multiple-choice' || question.type === 'true-false') {
        const correctOption = question.options.find(opt => opt.isCorrect);
        const isCorrect = correctOption && answer.selectedOptionId === correctOption.id;
        
        if (isCorrect) {
          score += question.points || 1;
        }
        
        return { 
          ...answer, 
          isCorrect, 
          points: isCorrect ? (question.points || 1) : 0 
        };
      } else if (question.type === 'open-ended') {
        // For open-ended questions, we'll need manual grading
        // Here we just record the answer
        return { 
          ...answer, 
          isCorrect: null, 
          points: 0 
        };
      }
      
      return { ...answer, isCorrect: false, points: 0 };
    });
    
    // Create assessment result
    const result = await AssessmentResult.create({
      userId,
      assessmentId,
      score,
      totalPoints,
      answers: gradedAnswers,
      timeTaken,
      completedAt: new Date()
    });
    
    res.status(201).json({
      id: result._id,
      score,
      totalPoints,
      percentage: Math.round((score / totalPoints) * 100),
      answers: gradedAnswers,
      completedAt: result.completedAt
    });
  } catch (error: any) {
    console.error('Submit assessment error:', error);
    res.status(500).json({ 
      message: 'Error submitting assessment',
      error: error.message 
    });
  }
};

// @desc    Get user's assessment results
// @route   GET /api/assessments/results
// @access  Private
export const getAssessmentResults = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    
    // Fetch user's results with assessment details
    const results = await AssessmentResult.find({ userId })
      .populate('assessmentId', 'title description category difficulty')
      .sort({ completedAt: -1 });
    
    res.json(results);
  } catch (error: any) {
    console.error('Get results error:', error);
    res.status(500).json({ 
      message: 'Error retrieving assessment results',
      error: error.message 
    });
  }
};
