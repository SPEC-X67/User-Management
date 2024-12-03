import userModel from "../models/user.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

class userController {
    static userRegistration = async (req, res) =>{
        const { name, email, password, gender, city } = req.body;
        try {
            if (!name || !email || !password || !gender || !city) {
                return res.status(400).json({ message: "All fields are required" });
            }

            const isEmail = await userModel.findOne({ email });
            if (isEmail) {
                return res.status(400).json({ message: "Email already exists" });
            }

            const genSalt = await bcryptjs.genSalt(10);
            const hashedPassword = await bcryptjs.hash(password, genSalt)

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
    };

    static userLogin = async (req, res) => {
        const {email, password} = req.body;

        try {
            if(email && password) {
                const isUser = await userModel.findOne({email});
                if(isUser) {
                    if(email === isUser.email && await bcryptjs.compare(password, isUser.password)){
                        // Generate token
                        const token = jwt.sign({userID : isUser._id}, "deBySpeczin", {
                            expiresIn : "2d",
                        });
                        return res
                        .status(200)
                        .json({
                            message: "Login Successfully",
                            token,
                            name : isUser.name,
                        })
                    } else {
                        return res.status(400).json({message: "Invalid Credentials!"})
                    }
                } else {
                    return res.status(400).json({message: "user Not Registered!!"})
                }
            } else {
                return res.status(400).json({message: "*all fields are required"})
            }
        } catch (error) {
            return res.status(400).json({message: error.message})
        }
    };

    static homeLoad = async (req, res) => {
        try {
            const user = req.user; // Assuming user is set by the `checkIsUserAuthenticated` middleware
            res.status(200).json({
                name: user.name,
                email: user.email,
                city: user.city,
                gender: user.gender,
                profile: user.profile, // Ensure this field exists in the user model
            });
        } catch (error) {
            res.status(500).json({ message: 'Failed to load user data' });
        } 
    }
}

export default userController;