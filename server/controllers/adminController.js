import userModel from '../models/user.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

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
                role: "user"
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

    static adminLogin = async(req, res) => {
        const { email, password } = req.body;
        try {
            if (!email || !password) {
                return res.status(400).json({ message: "All fields are required" });
            }

            const user = await userModel.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: "Invalid email or password" });
            }

            if (user.role !== "admin") {
                return res.status(403).json({ message: "Access denied. Admin only." });
            }

            const isMatch = await bcryptjs.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid email or password" });
            }

            // Generate admin token
            const adminToken = jwt.sign(
                { userID: user._id, role: user.role },
                "deBySpeczin",
                { expiresIn: "1d" }
            );

            return res.status(200).json({
                message: "Admin login successful",
                adminToken,
                name: user.name,
                role: user.role
            });

        } catch (error) {
            console.error("Admin login error:", error);
            return res.status(500).json({ message: "Server error during login" });
        }
    }
}

export default userController;