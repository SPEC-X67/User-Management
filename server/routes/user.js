import express from "express";
import userController from "../controllers/user.js";
import multer from "multer";
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, and WEBP are allowed.'));
        }
    },
});


router.get("/users", userController.getAllUsers);
router.post("/users", upload.single('profile'), userController.createNewUser)

export default router;