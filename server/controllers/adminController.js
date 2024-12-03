import userModel from '../models/user.js'
import bcryptjs from 'bcryptjs'

class userController {
    static getAllUsers = async(req, res) => {
        try {
            const fetchAllUsers = await userModel.find({});
            return res.status(200).json(fetchAllUsers);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching users", error: error.message });
        }
    }
    
    static createNewUser = async(req, res) => {
        const { name, email, password, gender, city } = req.body;
        try {
            if (!name || !email || !password || !gender || !city) {
                return res.status(400).json({ message: "All fields are required" });
            }

            const isEmail = await userModel.findOne({ email });
            if (isEmail) {
                return res.status(400).json({ message: "Email already exists" });
            }

            // Hash password
            const salt = await bcryptjs.genSalt(10);
            const hashedPassword = await bcryptjs.hash(password, salt);

            const profileImage = req.file ? req.file.filename : null;
            
            const newUser = new userModel({
                name,
                email,
                password: hashedPassword,
                gender,
                city,
                profile: profileImage,
            });

            const savedUser = await newUser.save();
            return res.status(201).json({
                message: "User registered successfully",
                user: savedUser
            });

        } catch (error) {
            console.error("Server error:", error);
            return res.status(500).json({
                message: "Error creating user",
                error: error.message
            });
        }
    }
}

export default userController;