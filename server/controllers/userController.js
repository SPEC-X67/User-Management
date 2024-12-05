import userModel from "../models/user.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

class userController {
  static userRegistration = async (req, res) => {
    const { name, email, password, gender, city } = req.body;
    try {
      const isEmail = await userModel.findOne({ email });
      if (isEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const genSalt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, genSalt);

      const profileImage = req.file ? req.file.filename : null;

      const newUser = new userModel({
        name,
        email,
        password: hashedPassword,
        gender,
        city,
        profile: profileImage,
        role: "user",
      });

      const savedUser = await newUser.save();
      return res.status(201).json({
        message: "User registered successfully",
        user: savedUser,
      });
    } catch (error) {
      console.error("Server error:", error);
      return res.status(500).json({
        message: "Error creating user",
        error: error.message,
      });
    }
  };

  static userLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
      if (email && password) {
        const isUser = await userModel.findOne({ email });
        if (isUser) {
          if (
            email === isUser.email &&
            (await bcryptjs.compare(password, isUser.password))
          ) {
            // Generate token
            const token = jwt.sign({ userID: isUser._id }, "deBySpeczin", {
              expiresIn: "2d",
            });
            return res.status(200).json({
              message: "Login Successfully",
              token,
              name: isUser.name,
            });
          } else {
            return res.status(400).json({ message: "Invalid Credentials!" });
          }
        } else {
          return res.status(400).json({ message: "user Not Registered!!" });
        }
      } else {
        return res.status(400).json({ message: "*all fields are required" });
      }
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  static homeLoad = async (req, res) => {
    try {
      const user = req.user; // Assuming user is set by the `checkIsUserAuthenticated` middleware
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        city: user.city,
        gender: user.gender,
        profile: user.profile, // Ensure this field exists in the user model
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to load user data" });
    }
  };

  // Update user profile
  static updateUserProfile = async (req, res) => {
    try {
      const { id } = req.params;

      const user = await userModel.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if email exists for any other user
      const existingUser = await userModel.findOne({
        email: req.body.email,
        _id: { $ne: id } // Exclude current user from check
      });

      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
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
}

export default userController;
