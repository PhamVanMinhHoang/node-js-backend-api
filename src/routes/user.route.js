import express from 'express';
import { AppError } from '../utils/appError.js';
import { validate } from '../middlewares/validate.js';
import {
  createUserBodySchema,
  updateUserBodySchema,
  listUsersQuerySchema,
  userIdParamsSchema
} from '../validators/user.validator.js';

import {
  createUserController,
  getUserByIdController,
  listUsersController,
  updateUserByIdController,
  deleteUserByIdController
} from '../controllers/user.controller.js';

const router = express.Router();

// demo errors (cụ thể trước)
router.get('/boom', () => {
  throw new AppError('Boom!', 400, 'BAD_REQUEST');
});

router.get('/error-demo', () => {
  throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
});

// CRUD + validation
router.post('/', validate({ body: createUserBodySchema }), createUserController);

router.get('/', validate({ query: listUsersQuerySchema }), listUsersController);

router.get('/:id', validate({ params: userIdParamsSchema }), getUserByIdController);

router.patch(
  '/:id',
  validate({ params: userIdParamsSchema, body: updateUserBodySchema }),
  updateUserByIdController
);

router.delete('/:id', validate({ params: userIdParamsSchema }), deleteUserByIdController);

export default router;