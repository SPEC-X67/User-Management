import express from "express";
import userController from "../controllers/userController.js"
const router = express.Router();

router.post("/users/register", userController.userRegistration);
router.post("/users/login", userController.userLogin);
export default router;