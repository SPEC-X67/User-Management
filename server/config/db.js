import mongoose from "mongoose";

const connectToMongo = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('Connected to MongoDB Successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

export default connectToMongo;