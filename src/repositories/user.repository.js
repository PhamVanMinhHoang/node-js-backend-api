import { User } from '../models/user.model.js';

export async function createUser(data)
{
    return User.create(data);
}

export async function findUserByEmail(email)
{        
    return User.findOne({email});
}

export async function findUserById(id)
{
    return User.findById(id)
}
export async function listUsers({filter, skip, limit, sort}) {
    const [items, total] = await Promise.all([
        User.find(filter).sort({sort}).skip(skip).limit(limit),
        User.countDocuments(filter)
    ])

    return {items, total}
}

export async function updateUserById(id, data) {
    return User.findByIdAndUpdate(id, data, {new: true, runValidators: true});
}

export async function deleteUserById(id) {
  return User.findByIdAndDelete(id);
}