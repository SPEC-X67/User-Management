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

    static EditUser = async(req, res) => {
        try {
            const {id} = req.params;
            
            // Check if user exists
            const user = await userModel.findById(id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            let userData = {
                name: req.body.name,
                email: req.body.email,
                gender: req.body.gender,
                city: req.body.city
            }
    
            // Handle profile image
            if (req.file) {
                userData.profile = req.file.filename;
            }

            // Handle password
            if (req.body.password) {
                const salt = await bcryptjs.genSalt(10);
                const hashedPassword = await bcryptjs.hash(req.body.password, salt);
                userData.password = hashedPassword;
            }

            // Update user and get updated document
            const updatedUser = await userModel.findByIdAndUpdate(
                id, 
                userData,
                { new: true } // Return updated document
            );

            return res.status(200).json(updatedUser);

        } catch (error) {
            console.error("Error updating user:", error);
            return res.status(500).json({ message: "Error updating user", error: error.message });
        }
    }

    static deleteUser = async(req, res) => {
        try {
            const { id } = req.params;
            
            // Check if user exists
            const user = await userModel.findById(id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Delete user
            const deletedUser = await userModel.findByIdAndDelete(id);
            
            // Delete user's profile image if it exists
            if (deletedUser.profile) {
                const fs = require('fs');
                const path = require('path');
                const profilePath = path.join(__dirname, '../../uploads', deletedUser.profile);
                if (fs.existsSync(profilePath)) {
                    fs.unlinkSync(profilePath);
                }
            }

            return res.status(200).json({ 
                message: "User deleted successfully", 
                deletedUser 
            });
        } catch (error) {
            return res.status(500).json({ message: "Error deleting user", error: error.message });
        }
    }
}

export default userController;