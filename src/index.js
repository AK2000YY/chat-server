import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
    res.send("hello guys from my server...");
})


app.listen(port, () => {
    console.log("server is running...")
})