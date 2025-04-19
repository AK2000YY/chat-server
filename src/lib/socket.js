import http from "http";
import { Server } from "socket.io";
import express from "express";


const app = express();
const server = http.createServer(app);
const io = new Server(server)

io.on("connection", (socket) => {
})

export { app, server, io }