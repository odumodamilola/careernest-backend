import { Request, Response, NextFunction } from 'express';
import { ZodSchema, z } from 'zod';

// Middleware for Zod schema validation
export const validate = (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      let dataToValidate: any;
      
      switch (source) {
        case 'body':
          dataToValidate = req.body;
          break;
        case 'query':
          dataToValidate = req.query;
          break;
        case 'params':
          dataToValidate = req.params;
          break;
        default:
          dataToValidate = req.body;
      }

      const result = schema.safeParse(dataToValidate);
      
      if (!result.success) {
        // Extract validation errors
        const formatted = result.error.format();
        return res.status(400).json({ 
          message: 'Validation error', 
          errors: formatted
        });
      }

      // Replace original data with validated and transformed data
      if (source === 'body') req.body = result.data;
      if (source === 'query') req.query = result.data as any;
      if (source === 'params') req.params = result.data as any;

      next();
    } catch (error: any) {
      return res.status(500).json({ 
        message: 'Validation error',
        error: error.message
      });
    }
  };
};

// Common parameter validation schemas
export const idParamSchema = z.object({
  id: z.number().int().positive()
});
