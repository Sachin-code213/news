import mongoose from 'mongoose';

// server/src/config/db.ts
const connectDB = async () => {
    try {
        // Updated to target 'nepali_news' database
        const conn = await mongoose.connect("mongodb+srv://news_admin:1000021133@news.b8dvnx8.mongodb.net/nepali_news?retryWrites=true&w=majority");
        console.log(`info: MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        process.exit(1);
    }
};

export default connectDB;
