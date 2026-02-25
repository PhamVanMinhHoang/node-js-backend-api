import { created, ok } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { 
    createUserService, 
    findUserByIdService,
    listUsersService,
    updateUserByIdService,
    deleteUserByIdService
 } from '../services/user.service.js';

export const createUserController = asyncHandler(async(req, res, next) => {
    const user = await createUserService(req.validated.body);
    return created(res, user);
});

export const getUserByIdController = asyncHandler(async(req, res, next) => {
    const user = await findUserByIdService(req.validated.params.id)
    return ok(res, user);
});

export const listUsersController = asyncHandler(async(req, res, next) => {
    const result = await listUsersService(req.validated.query);
    return ok(res, result.items, result.meta);
});
    

export const updateUserByIdController = asyncHandler(async(req, res, next) => {
    const user = await updateUserByIdService(req.validated.params.id, req.body);
    return ok(res, user);
});
  

export const deleteUserByIdController = asyncHandler(async(req, res, next) => {
    const result = await deleteUserByIdService(req.validated.params.id);
    return ok(res, result);
});
  