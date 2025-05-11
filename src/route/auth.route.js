import express from "express";
import { changePassword, changePhoto, changeUsername, checkAuth, login, logout, signup } from "../controller/auth.controller.js";
import protect from "../middleware/auth.middleware.js";
import upload from "../lib/multer.js";


const authRoute = express.Router();


authRoute.post("/signup", signup)

authRoute.post("/login", login)

authRoute.post("/logout", protect, logout)

authRoute.post("/change-photo", protect, upload.single('avatar'), changePhoto)

authRoute.post("/change-username", protect, changeUsername)

authRoute.post("/change-password", protect, changePassword)

authRoute.get("/auth-state", checkAuth)



export default authRoute;