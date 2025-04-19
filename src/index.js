import dotenv from "dotenv";
import { app, server } from "./lib/socket.js";
import connectDB from "./lib/db.js";

dotenv.config();
const PORT = process.env.PORT;

app.get('/', (req, res) => {
    res.send("hello guyse form my server!..")
})

server.listen(PORT, () => {
    console.log("server is running...")
    connectDB()
})