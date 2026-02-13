import mongoose from "mongoose";

export async function connectDB() {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
        throw new Error('Missing MONGODB_URI in .env');
    }

    mongoose.connection.on('connected', () => {
        console.log('✅ MongoDB connected');
    })

    mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
    })

    mongoose.connection.on('disconnect', () => {
        console.warn('⚠️ MongoDB disconnected');
        
    })

    // Mongoose v6+ dùng option mặc định tốt, không cần useNewUrlParser...
    await mongoose.connect(uri);

}