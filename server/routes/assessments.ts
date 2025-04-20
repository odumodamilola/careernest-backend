import express from 'express';
import { 
  getAssessments, 
  getAssessmentById, 
  submitAssessment, 
  getAssessmentResults 
} from '../controllers/assessmentController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { idParamSchema } from '../middleware/validate';
import { submitAssessmentSchema } from '@shared/schema';

const router = express.Router();

// All routes in this file are protected
router.use(protect);

// Get all assessments
router.get('/', getAssessments);

// Get user's assessment results
router.get('/results', getAssessmentResults);

// Get assessment by ID
router.get('/:id', validate(idParamSchema, 'params'), getAssessmentById);

// Submit an assessment
router.post(
  '/:id/submit', 
  validate(idParamSchema, 'params'),
  validate(submitAssessmentSchema),
  submitAssessment
);

export default router;
