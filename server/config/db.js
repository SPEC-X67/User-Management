import mongoose from "mongoose";

const connectToMongo = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/fxManagement");
        console.log('Connected to MongoDB Successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectToMongo;