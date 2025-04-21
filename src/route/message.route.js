import express from "express";
import { deleteMessage, getMessage, getChanges, sendMessage, updateMessage } from "../controller/message.controller.js";
import upload from "../lib/multer.js";
import protect from "../middleware/auth.middleware.js";

const messageRoute = express.Router();


messageRoute.get("/", getMessage);

messageRoute.get("/getChanges", getChanges);

messageRoute.post("/message", protect, upload.single('avatar'), sendMessage);

messageRoute.patch("/:message", updateMessage);

messageRoute.delete("/:message", deleteMessage);


export default messageRoute;