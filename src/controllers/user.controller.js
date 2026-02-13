import { created, ok } from '../utils/response.js';
import { 
    createUserService, 
    findUserByIdService,
    listUsersService,
    updateUserByIdService,
    deleteUserByIdService
 } from '../services/user.service.js';

export async function createUserController(req, res, next)
{
    try{
        const user = await createUserService(req.body);
        return created(res, user);
    } catch (err) {
        next(err);
    }
}

export async function findUserByIdController(req, res, next)
{
    try {
        const user = await findUserByIdService(req.params.id)
        return ok(res, user);
    } catch (err) {
        next(err);
    }
}

export async function listUsersController(req, res, next) {
    try {
        const result = await listUsersService(req.query);
        return ok(res, result.items, result.meta);
    } catch (err) {
        next(err);
    }
}

export async function updateUserByIdController(req, res, next) {
  try {
    const user = await updateUserByIdService(req.params.id, req.body);
    return ok(res, user);
  } catch (err) {
    next(err);
  }
}

export async function deleteUserByIdController(req, res, next) {
  try {
    const result = await deleteUserByIdService(req.params.id);
    return ok(res, result);
  } catch (err) {
    next(err);
  }
}