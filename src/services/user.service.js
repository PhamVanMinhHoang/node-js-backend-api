import { AppError } from '../utils/appError.js';
import { isValidObjectId } from '../utils/mongo.js';
import { 
    createUser, 
    findUserByEmail, 
    findUserById, 
    listUsers, 
    updateUserById, 
    deleteUserById
} from '../repositories/user.repository.js';

function toPublicUser(u) {
  return {
    id: u._id,
    email: u.email,
    name: u.name,
    role: u.role,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt
  };
}

export async function createUserService(payload) {
    const exists = await findUserByEmail(payload.email);
    if(exists){
        throw new AppError('Email already exists', 409, 'EMAIL_EXISTS');
    }
    // ⚠️ Day 15 mới hash password. Hôm nay lưu thẳng để test flow DB.
    const user = await createUser(payload);

    return toPublicUser(user);
}

export async function findUserByIdService(id) {
    if (!isValidObjectId(id)) throw new AppError('Invalid user id', 400, 'INVALID_ID');

    const user = await findUserById(id);
    if(!user){
        throw new AppError(`Not Found User with id = ${id}`, 404, 'NOT_FOUND')
    }

    return toPublicUser(user);
}

export async function listUsersService({ page = 1, limit = 10, search, role, sort, order }) {
    const p = Number(page);
    const l = Number(limit);

    if (!Number.isFinite(p) || p < 1) throw new AppError('Invalid page', 400, 'INVALID_PAGE');
    if (!Number.isFinite(l) || l < 1 || l > 100) throw new AppError('Invalid limit', 400, 'INVALID_LIMIT');

    const skip = (p - 1) * l;
    
    // ✅ Filter do server build
    const filter = {};

    if (role) {
        filter.role = role;
    }

    if (search) {
        // Escape regex để tránh user nhập ký tự regex gây nặng query
        const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        filter.$or = [
            { email: { $regex: escaped, $options: 'i' } },
            { name: { $regex: escaped, $options: 'i' } }
        ];
    }

    // ✅ Sort whitelist đã đảm bảo ở Zod
    const dir = order === 'asc' ? 1 : -1;
    const sortObj = { [sort]: dir, _id: -1 }; // tie-breaker ổn định    

    const { items, total } = await listUsers({ filter, skip, limit: l, sort: sortObj });

    return {
        items: items.map(toPublicUser),
        meta: {
            page: p,
            limit: l,
            total,
            totalPages: Math.ceil(total / l),
            sort,
            order,
            ...(search ? { search } : {}),
            ...(role ? { role } : {})
        }
    }
}

export async function updateUserByIdService(id, payload) {
    if (!isValidObjectId(id)) throw new AppError('Invalid user id', 400, 'INVALID_ID');

    if(payload.email) {
        const exists = await findUserByEmail(payload.email);
        if(exists && String(exists._id) !== String(id)) {
            throw new AppError('Email already exists', 409, 'EMAIL_EXISTS');
        }
    }

    if(payload.role) {
        throw new AppError('ROLE UPDATE NOT ALLOWED', 400, 'ROLE_UPDATE_NOT_ALLOWED');
    }

    const updated = await updateUserById(id, payload);
    if (!updated) throw new AppError('User not found', 404, 'USER_NOT_FOUND');

    return toPublicUser(updated);
}

export async function deleteUserByIdService(id) {
  if (!isValidObjectId(id)) throw new AppError('Invalid user id', 400, 'INVALID_ID');

  const deleted = await deleteUserById(id);
  if (!deleted) throw new AppError('User not found', 404, 'USER_NOT_FOUND');

  return { id };
}