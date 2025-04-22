import express from "express";
import { checkAuth, login, logout, signup } from "../controller/auth.controller.js";


const authRoute = express.Router();


authRoute.post("/signup", signup)

authRoute.post("/login", login)

authRoute.post("/logout", logout)

authRoute.get("/auth-state", checkAuth)



export default authRoute;