import http from "http";
import { Server } from "socket.io";
import express from "express";


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    },
});

const userMap = {};

function getUserSocketId(id) {
    return userMap[id];
}

io.on("connection", (socket) => {
    const userId = socket.handshake.query.id;
    if (userId) userMap[userId] = socket.id;

    io.emit("getOnlineUser", Object.keys(userMap));

    socket.on("disconnect", () => {
        delete userMap[userId];
        io.emit("getOnlineUser", Object.keys(userMap));
    })
})

export { app, server, io, getUserSocketId }