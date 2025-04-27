import express from "express";
import { deleteMessage, getMessage, getChanges, sendMessage, updateMessage, updateToRead } from "../controller/message.controller.js";
import upload from "../lib/multer.js";
import protect from "../middleware/auth.middleware.js";


const messageRoute = express.Router();


messageRoute.get("/", protect, getMessage);

messageRoute.get("/getChanges", protect, getChanges);

messageRoute.post("/update-message", protect, updateToRead);

messageRoute.post("/", protect, upload.single('avatar'), sendMessage);

messageRoute.patch("/", protect, updateMessage);

messageRoute.delete("/", protect, deleteMessage);


export default messageRoute;