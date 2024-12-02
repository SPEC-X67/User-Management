import mongoose from "mongoose";

const connectToMongo = async () => {
    const res = await mongoose.connect("mongodb://localhost:27017/fxManagement");
    if(res){
        console.log('connected Successfully..');
    } 
}

export default connectToMongo;