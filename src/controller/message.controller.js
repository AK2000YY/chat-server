import mongoose from "mongoose";
import { io, getUserSocketId } from "../lib/socket.js";
import Message from "../model/message.model.js";

const getMessage = async (req, res) => {
    try {
        const userId = req.id;
        const friendId = req.body.friendId;
        const messageId = req.body.messageId;
        let messages;
        if (!messageId) {
            messages = await Message
                .find({
                    $or: [
                        { $and: [{ sender: userId }, { receiver: friendId }] },
                        { $and: [{ sender: friendId }, { receiver: userId }] }
                    ]
                })
                .sort({ _id: -1 })
                .limit(20);
        } else {
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
        console.log(messages);
        res.status(201).json(messages.reverse())
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: e.message })
    }
}

const checkSentMessage = async (req, res) => {
    try {
        const messagesId = req.body.messagesId;
        const messages = await Message.find({ _id: { $in: messagesId } })
        res.status(201).json(messages);
    } catch (e) {
        res.status(501).json(e.message);
    }
}

const getUnsentMessages = async (req, res) => {
    try {
        const userId = req.id;
        const messages = await Message
            .find(
                {
                    receiver: userId,
                    messageStatus: "sent"
                }
            )
            .sort({ sender: 1 });

        await Message.updateMany(
            { receiver: userId, messageStatus: "sent" },
            { $set: { messageStatus: "delivere" } }
        );

        messages.filter(ele => {
            const sender = getUserSocketId(ele.sender);
            if (sender) io.to(sender).emit("delivere", ele._id);
        });

        res.status(201).json(messages);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

const getChatPhoto = async (req, res) => {
    try {
        const userId = req.id;
        const friend = req.body.friendId;
        const photo = await Message.find({
            media: { $ne: "" },
            $or: [
                { sender: userId, receiver: friend },
                { sender: friend, receiver: userId }
            ]
        }, { media: 1 });
        res.status(201).json(photo);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

const updateToRead = async (req, res) => {
    try {
        const receiverId = req.id;
        const messageId = req.body.messageId;
        const message = await Message.findByIdAndUpdate(messageId,
            [
                {
                    $set: {
                        messageStatus: {
                            $cond: {
                                if: { $eq: ["$receiver", new mongoose.Types.ObjectId(receiverId + "")] },
                                then: "read",
                                else: "$messageStatus"
                            }
                        }
                    }
                }
            ],
            {
                new: true
            }
        );
        const sender = getUserSocketId(message.sender);
        if (sender)
            io.to(sender).emit("read", messageId);
        res.status(201).json("ok");
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

const sendMessage = async (req, res) => {
    try {
        let media = "";
        let message = "";
        if (req.file && req.file.filename) media = req.file.filename;
        if (req.body.message) message = req.body.message;

        const sender = req.id;
        const receiver = req.body.receiver;

        if (message === "" && media === "")
            throw new Error("message is empty!");

        let messageRes = await Message.create({ media, message, sender, receiver });

        const receiverSocket = getUserSocketId(receiver);

        if (receiverSocket) {
            const emitResponse = await new Promise((resolve, reject) => {
                io.timeout(5000).to(receiverSocket).emit(
                    "message",
                    { messageRes: { ...messageRes.toObject(), messageStatus: "delivere" } },
                    (err, response) => {
                        if (err) return reject(err);
                        resolve(response);
                    }
                );
            });

            if (emitResponse[0].status === "ok") {
                messageRes = await Message.findByIdAndUpdate(
                    messageRes._id,
                    { $set: { messageStatus: "delivere" } },
                    { new: true }
                );
            }
        }

        if (messageRes.messageStatus === "delivere") {
            const senderSocket = getUserSocketId(messageRes.sender);
            if (senderSocket) {
                io.to(senderSocket).emit("delivere", messageRes._id);
            }
        }

        res.status(201).json(messageRes);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};


const updateMessage = async (req, res) => {
}

const deleteMessage = async (req, res) => {
}


export { getMessage, checkSentMessage, getChatPhoto, sendMessage, updateMessage, deleteMessage, getUnsentMessages, updateToRead };