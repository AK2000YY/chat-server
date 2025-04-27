import { io, getUserSocketId } from "../lib/socket.js";
import Message from "../model/message.model.js";
import mongoose from "mongoose";

const getMessage = async (req, res) => {
    try {
        const userId = req.id;
        const messageId = req.body.messageId;
        let messages;
        if (!messageId) {
            messages = await Message
                .find({
                    $or: [
                        { sender: userId },
                        { receiver: userId }
                    ]
                })
                .sort({ _id: -1 })
                .limit(20);
        }
        else {
            messages = await Message
                .find({
                    _id: { $lt: messageId },
                    $or: [
                        { sender: userId },
                        { receiver: userId }
                    ]
                })
                .sort({ _id: -1 })
                .limit(20);
        }
        res.status(201).json({ messages })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

const getChanges = async (req, res) => {
    try {
        const userId = req.id;
        const messages = await Message.aggregate([
            {
                $match: {
                    receiver: new mongoose.Types.ObjectId(userId + ""),
                    messageStatus: "sent"
                }
            },
            {
                $group: {
                    _id: "$sender",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    sender: "$_id",
                    count: 1,
                    _id: 0
                }
            }
        ]);

        await Message.updateMany(
            { receiver: userId, messageStatus: "sent" },
            { $set: { messageStatus: "delivere" } }
        )

        messages.forEach(ele => {
            io.to(ele.sender).emit("delivere", userId);
        });

        res.status(201).json(messages);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

const updateToRead = async (req, res) => {
    try {
        const userId = req.id;
        const senderId = req.body.senderId;
        const messageId = req.body.messageId;
        await Message.findOneAndUpdate({ _id: messageId, receiver: userId }, { $set: { messageStatus: "read" } });
        const snederSocket = getUserSocketId(senderId);
        if (snederSocket)
            io.to(snederSocket).emit("read", messageId);
        res.status(201).json({ message: "message is read!" })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

const sendMessage = async (req, res) => {
    try {
        let media = "";
        let message = "";
        if (req.file && req.file.filename) media = (req.file.filename);
        if (req.body.message) message = req.body.message;
        const sender = req.id;
        const receiver = req.body.receiver;
        if (message === "" && media === "")
            throw new Error("message is empty!");
        await Message.create({ media, message, sender, receiver });
        const receiverSocket = getUserSocketId(receiver);
        if (receiverSocket)
            io.to(receiverSocket).emit("message", { media, message, sender, receiver });
        res.status(201).json({ message: "message is sent!" })
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

const updateMessage = async (req, res) => {
}

const deleteMessage = async (req, res) => {
}


export { getMessage, sendMessage, updateMessage, deleteMessage, getChanges, updateToRead };