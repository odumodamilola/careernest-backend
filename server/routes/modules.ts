import express from 'express';
import { 
  getModules, 
  getModuleById, 
  completeModule 
} from '../controllers/moduleController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { idParamSchema } from '../middleware/validate';

const router = express.Router();

// All routes in this file are protected
router.use(protect);

// Get all modules
router.get('/', getModules);

// Get module by ID
router.get('/:id', validate(idParamSchema, 'params'), getModuleById);

// Mark a module as completed
router.post('/:id/complete', validate(idParamSchema, 'params'), completeModule);

export default router;
