import express from "express";
import dotenv from "dotenv";
import { app, server } from "./lib/socket.js";
import connectDB from "./lib/db.js";
import authRoute from "./route/auth.route.js";
import cookieParser from "cookie-parser";
import messageRoute from "./route/message.route.js";

dotenv.config();
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT;

app.use('/auth', authRoute);
app.use('/uploads', express.static("src/media"));
app.use('/message', messageRoute);

server.listen(PORT, () => {
    console.log("server is running...")
    connectDB()
})