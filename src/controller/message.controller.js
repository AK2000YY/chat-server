import { io, getUserSocketId } from "../lib/socket.js";
import Message from "../model/message.model.js";

const getMessage = async (req, res) => {
    try {
        const userId = req.user.id;
        const messages = await Message.find({
            $or: [
                { sender: userId },
                { receiver: userId }
            ]
        });
        res.status(201).json({ messages })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

const getChanges = async (req, res) => {
    try {
        const userId = req.user.id;
        const messages = await Message.find({
            $and: [
                { receiver: userId },
                { messageStatus: "sent" }
            ]
        });
        const changes = messages.map(message => {
            message.messageStatus = 'delivere';
            message.save();
        })
        res.status(201).json({ changes });
    } catch (e) {
        res.status(500).json({ message: e.message });
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


export { getMessage, sendMessage, updateMessage, deleteMessage, getChanges };