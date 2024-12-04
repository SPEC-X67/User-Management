import mongoose from "mongoose";

const newSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type : String
    },
    password: {
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
    },
    role: {
        type: String,
        default: "user"
    }
});

const userModel = mongoose.model("users", newSchema);
export default userModel;