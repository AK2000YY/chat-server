import express from "express";
import { checkSentMessage, deleteMessage, getMessage, getChatPhoto, getUnsentMessages, sendMessage, updateMessage, updateToRead } from "../controller/message.controller.js";
import upload from "../lib/multer.js";
import protect from "../middleware/auth.middleware.js";


const messageRoute = express.Router();


messageRoute.post("/get-messages", protect, getMessage);

messageRoute.get("/get-unsent-message", protect, getUnsentMessages);

messageRoute.post("/all-chat-photo", protect, getChatPhoto)

messageRoute.post("/check-sent-message", protect, checkSentMessage);

messageRoute.post("/update-message", protect, updateToRead);

messageRoute.post("/", protect, upload.single('avatar'), sendMessage);

messageRoute.patch("/", protect, updateMessage);

messageRoute.delete("/", protect, deleteMessage);


export default messageRoute;