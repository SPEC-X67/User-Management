import mongoose from "mongoose";

const newSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type : String
    },
    gender: {
        type : String
    },
    city: {
        type: String
    },
    profile: {
        type: String
    }
});

const userModel = mongoose.model("users", newSchema);
export default userModel;