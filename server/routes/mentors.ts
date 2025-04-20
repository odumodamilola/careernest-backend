import express from 'express';
import { 
  getMentors, 
  getMentorById, 
  scheduleSession 
} from '../controllers/mentorController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { idParamSchema } from '../middleware/validate';

const router = express.Router();

// All routes in this file are protected
router.use(protect);

// Get all mentors
router.get('/', getMentors);

// Get mentor by ID
router.get('/:id', validate(idParamSchema, 'params'), getMentorById);

// Schedule a session with a mentor
router.post('/schedule/:id', validate(idParamSchema, 'params'), scheduleSession);

export default router;
