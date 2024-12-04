import express from "express";
import userController from "../controllers/adminController.js";
import checkIsUserAuthenticated from "../middlewares/authMiddleware.js"
import multer from "multer";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Public routes
router.post("/login", userController.adminLogin);

// Protected routes (require authentication)
router.get("/users", checkIsUserAuthenticated, userController.getAllUsers);
router.post("/users", checkIsUserAuthenticated, upload.single('profile'), userController.createNewUser);
router.put("/users/edituser/:id", checkIsUserAuthenticated, upload.single('profile'), userController.EditUser);

export default router;