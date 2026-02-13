import express from 'express';  
import { AppError } from '../utils/appError.js';
import { ok } from '../utils/response.js';
import { 
    createUserController, 
    findUserByIdController, 
    listUsersController,
    updateUserByIdController,
    deleteUserByIdController
 } from '../controllers/user.controller.js';

const router = express.Router();


router.get('/boom', (req, res) => {
    throw new AppError('Boom!', 400, 'BAD_REQUEST')
});

router.get('/error-demo', () => {
  throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
});

// CRUD
router.post('/', createUserController);
router.get('/', listUsersController);
router.get('/:id', findUserByIdController);
router.patch('/:id', updateUserByIdController);
router.delete('/:id', deleteUserByIdController);

export default router ;