import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6, 
            select: false   // ✅ mặc định không trả về password
        },
        name: {
            type: String,
            defaule: '',
            trim: true,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        }
    }
)

export const User = mongoose.model('User', userSchema);