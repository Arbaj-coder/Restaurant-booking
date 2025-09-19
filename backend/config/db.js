import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


const connectDB = async () => {
try {
if (!process.env.MONGO_URI) throw new Error('MONGO_URI is missing in .env');
await mongoose.connect(process.env.MONGO_URI, {
// options are handled automatically by mongoose 6+
});
console.log('MongoDB connected');
} catch (err) {
console.error('MongoDB connection error:', err.message);
process.exit(1);
}
};


export default connectDB;