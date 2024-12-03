import express from "express";
import userController from "../controllers/userController.js";
import checkIsUserAuthenticated from "../middlewares/authMiddleware.js"

const router = express.Router();

router.post("/users/register", userController.userRegistration);
router.post("/users/login", userController.userLogin);
router.post("/users/home", checkIsUserAuthenticated, userController.homeLoad)

export default router;