import express from 'express';
import { 
  getCareers, 
  getCareerById, 
  bookmarkCareer, 
  getBookmarkedCareers 
} from '../controllers/careerController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { idParamSchema } from '../middleware/validate';

const router = express.Router();

// All routes in this file are protected
router.use(protect);

// Get all careers
router.get('/', getCareers);

// Get career by ID
router.get('/:id', validate(idParamSchema, 'params'), getCareerById);

// Bookmark a career
router.post('/bookmark/:id', validate(idParamSchema, 'params'), bookmarkCareer);

// Get bookmarked careers
router.get('/bookmarks', getBookmarkedCareers);

export default router;
