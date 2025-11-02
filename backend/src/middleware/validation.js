import { z } from 'zod';

/**
 * Validation middleware factory
 * Creates middleware to validate request body, params, or query
 */
export const validationMiddleware = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      let dataToValidate;
      
      switch (source) {
        case 'body':
          dataToValidate = req.body;
          break;
        case 'params':
          dataToValidate = req.params;
          break;
        case 'query':
          dataToValidate = req.query;
          break;
        default:
          dataToValidate = req.body;
      }

      const validatedData = schema.parse(dataToValidate);
      
      // Replace the original data with validated data
      switch (source) {
        case 'body':
          req.body = validatedData;
          break;
        case 'params':
          req.params = validatedData;
          break;
        case 'query':
          req.query = validatedData;
          break;
      }

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid request data',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code,
          })),
        });
      }

      next(error);
    }
  };
};

/**
 * Common validation schemas
 */
export const schemas = {
  // MongoDB ObjectId validation
  mongoId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
  
  // Pagination
  pagination: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    sort: z.string().optional(),
    order: z.enum(['asc', 'desc']).default('asc'),
  }),

  // Date range
  dateRange: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),

  // Search
  search: z.object({
    q: z.string().min(1).max(100).optional(),
    fields: z.array(z.string()).optional(),
  }),
};