import { distance } from "fastest-levenshtein";
import Friend from "../model/friend.model.js";
import User from "../model/user.model.js";

const getFriends = async (req, res) => {
    try {
        const userId = req.id;
        const frinds = await Friend.find({ user: userId }).populate("friend", "_id userName fullName avater");
        res.status(201).json(frinds.map(friend => friend.friend))
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

const search = async (req, res) => {
    try {
        let result = [];
        const userId = req.id;
        const query = req.body.query;
        const users = await User.find({ _id: { $ne: userId } }, { password: 0, email: 0 });
        result = users
            .map(ele => {
                return {
                    ...ele._doc,
                    dis: distance(ele.userName, query)
                }
            })
            .sort((a, b) => a.dis - b.dis)
            .slice(0, 20);
        res.status(201).json(result);
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: e.message });
    }
}

const addFriend = async (req, res) => {
    try {
        const userId = req.id;
        const friendId = req.body.id;
        await Friend.create({ user: userId, friend: friendId });
        res.status(201).json({ message: "add friend is success!" });
    } catch (error) {
        res.status(500).json({ message: e.message });
    }
}

const deleteFriend = async (req, res) => {
    try {
        const userId = req.id;
        const friendId = req.body.id;
        await Friend.findOneAndDelete({ user: userId, friend: friendId });
        res.status(201).json({ message: "delete friend is success!" });
    } catch (error) {
        res.status(500).json({ message: e.message });
    }
}




export { getFriends, search, addFriend, deleteFriend };