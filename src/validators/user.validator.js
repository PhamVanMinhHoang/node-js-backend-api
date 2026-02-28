import { z } from '../middlewares/validate.js';

// ObjectId: 24 hex chars
export const objectIdSchema = z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid ObjectId');

export const createUserBodySchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase().trim()),
  password: z.string().min(6),
  name: z.string().trim().optional().default(''),
  // không cho client set role ngay từ đầu
}).strict();

export const updateUserBodySchema = z
  .object({
    email: z.string().email().transform((v) => v.toLowerCase().trim()).optional(),
    password: z.string().min(6).optional(), // Day 15 mới hash
    name: z.string().trim().optional(),
    // role bị chặn
    role: z.any().optional()
  })
  .strict()
  .superRefine((val, ctx) => {
    if (val.role !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'role update is not allowed'
      });
    }
  });

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().min(1, 'search must not be empty').max(100, 'search too long').optional(),
  role: z.enum(['user', 'admin']).optional(),
  sort: z.enum(['createdAt', 'email', 'name']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc')
});

export const userIdParamsSchema = z.object({
  id: objectIdSchema
});