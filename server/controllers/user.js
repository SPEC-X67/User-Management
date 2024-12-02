import userModel from '../models/user.js'

class userController {
    static getAllUsers = async(req, res) => {
        const fetchAllUsers = await userModel.find({});
        return res.status(200).json(fetchAllUsers)
    }
    
    static createNewUser = async(req, res) => {
        const {name, email, gender, city} = req.body;
        try {
            if(name && email && gender && city) {
                const isEmail = await userModel.findOne({ email });
                if(!isEmail) {
                    const profileImage = req.file ? req.file.filename : null; // Check if file exists
                    const newUser = userModel({
                        name, 
                        email,
                        gender,
                        city,
                        profile : profileImage,
                    });

                    const response = await newUser.save();
                    if(response) {
                        return res.status(200).json({message: "Successfully registered"});
                    }
                } else {
                    return res.status(400).json({message: "user already exixts"});
                }
            } else {
                return res.status(400).json({message: "*all fields are required"})
            }
        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    }
}

export default userController;