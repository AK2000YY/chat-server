import express from "express";
import dotenv from "dotenv";
import { app, server } from "./lib/socket.js";
import connectDB from "./lib/db.js";
import authRoute from "./route/auth.route.js";
import cookieParser from "cookie-parser";
import messageRoute from "./route/message.route.js";
import cors from "cors";
import friendRouter from "./route/friend.route.js";

dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
const PORT = process.env.PORT;

app.use('/auth', authRoute);
app.use('/friend', friendRouter);
app.use('/message', messageRoute);
app.use('/uploads', express.static("src/media"));

server.listen(PORT, () => {
    console.log("server is running...")
    connectDB()
})