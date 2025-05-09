import express from "express";
import { addFriend, deleteFriend, getFriends, search } from "../controller/friend.controller.js";
import protect from "../middleware/auth.middleware.js";


const friendRouter = express.Router();


friendRouter.get('/', protect, getFriends);

friendRouter.post('/search', protect, search);

friendRouter.post('/', protect, addFriend);

friendRouter.delete('/', protect, deleteFriend);


export default friendRouter;