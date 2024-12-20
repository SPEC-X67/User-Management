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
        const { name, email, password, gender, city, role } = req.body;
        try {
            const isEmail = await userModel.findOne({ email });
            if (isEmail) {
                return res.status(400).json({ message: "Email already exists" });
            }

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
                role: role || "user" // Use the role from request or default to "user"
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
            const user = await userModel.findOne({ email });
            if (!user || user.role !== "admin") {
                return res.status(401).json({ message: "Invalid email or password" });
            }

            const isMatch = await bcryptjs.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid email or password" });
            }

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
            const { id } = req.params;

            // Check for existing email but exclude current user
            const existingUser = await userModel.findOne({ 
                email: req.body.email, 
                _id: { $ne: id } 
            });
            
            if (existingUser) {
                return res.status(400).json({ message: "Email already exists." });
            }

            let userData = {
                name: req.body.name,
                email: req.body.email,
                gender: req.body.gender,
                city: req.body.city,
                role: req.body.role // Add role to userData
            };

            // Only update password if it's provided
            if (req.body.password) {
                const salt = await bcryptjs.genSalt(10);
                userData.password = await bcryptjs.hash(req.body.password, salt);
            }

            // Update profile image if provided
            if (req.file) {
                userData.profile = req.file.filename;
            }

            const updatedUser = await userModel.findByIdAndUpdate(
                id,
                { $set: userData },
                { new: true }
            );

            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }

            return res.status(200).json({
                message: "User updated successfully",
                user: updatedUser
            });

        } catch (error) {
            console.error("Update error:", error);
            return res.status(500).json({ message: "Error updating user" });
        }
    }

    static deleteUser = async(req, res) => {
        try {
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).json({ message: "User ID is required" });
            }

            // Check if user exists
            const user = await userModel.findById(id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Delete user
            const deletedUser = await userModel.findByIdAndDelete(id);
            if (!deletedUser) {
                return res.status(404).json({ message: "User not found or already deleted" });
            }
             
            // Delete user's profile image if it exists
            if (deletedUser.profile) {
                try {
                    const fs = require('fs');
                    const path = require('path');
                    const profilePath = path.join(__dirname, '../../uploads', deletedUser.profile);
                    if (fs.existsSync(profilePath)) {
                        fs.unlinkSync(profilePath);
                    }
                } catch (fileError) {
                    console.error("Error deleting profile image:", fileError);
                    // Continue with the response even if image deletion fails
                }
            }

            return res.status(200).json({ 
                success: true,
                message: "User deleted successfully", 
                deletedUser 
            });

        } catch (error) {
            console.error("Delete user error:", error);
            return res.status(500).json({ 
                success: false,
                message: "Error deleting user", 
                error: error.message 
            });
        }
    }
}

export default userController;