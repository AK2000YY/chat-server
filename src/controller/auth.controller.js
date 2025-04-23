import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken, updateToken } from "../lib/utils.js";
import Session from "../model/session.model.js";
import User from "../model/user.model.js";

const trimParams = (inputUser) => {
    const user = {
        userName: (inputUser.userName || "").trim(),
        fullName: {
            firstName: (inputUser.fullName?.firstName || "").trim(),
            lastName: (inputUser.fullName?.lastName || "").trim()
        },
        email: (inputUser.email || "").trim(),
        password: (inputUser.password || "").trim()
    }
    return user;
}

const validateUser = (user, storedUser) => {
    if (storedUser && user.userName === storedUser.userName)
        throw new Error("username is used!");
    else if (storedUser && user.email === storedUser.email)
        throw new Error("email is used!");
    else if (user.userName.length < 3)
        throw new Error("username must be at least 3 character!")
    else if (user.fullName.firstName.length < 3)
        throw new Error("first name must be at least 3 character!")
    else if (user.fullName.lastName.length < 3)
        throw new Error("last name must be at least 3 character!")
    else if (! /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(user.email))
        throw new Error("enter a valid email!");
    else if (user.password.length < 6)
        throw new Error("password dosn't be less than 6 character!");
}

const signup = async (req, res) => {
    try {
        const { userName, fullName, email, password } = trimParams(req.body);
        const storedUser = await User.findOne({ $or: [{ userName: userName.trim() }, { email: email.trim() }] });
        validateUser({ userName, fullName, email, password }, storedUser);
        await User.create({ userName, fullName, email, password });
        res.status(201).json({ message: "create user is successed!" })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = trimParams(req.body);
        const user = await User.findOne({ email });
        if (!user || !await user.comparePassword(password))
            throw new Error("infromation is'nt validate!")
        generateAccessToken(user._id, res);
        const refreshToken = generateRefreshToken(user._id, res);
        const storedRefreshToken = await Session.findOne({ userId: user._id })
        if (!storedRefreshToken) {
            await Session.create({ refreshToken, userId: user._id });
        } else {
            res.cookie("refreshToken", storedRefreshToken.refreshToken, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: "strict"
            });
        }
        res.status(201).json({ _id: user._id })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

const logout = async (req, res) => {
    try {
        const { userId } = req.body;
        await Session.deleteMany({ userId });
        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");
        res.status(201).json({ message: "user is logouted!" })
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}


const checkAuth = async (req, res) => {
    try {
        const { accessToken, refreshToken } = req.cookies;
        if (!refreshToken)
            throw Error("no authintication!");
        const userId = req.id;
        try {
            const decode = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
            const user = await User.findOne({ _id: decode.userId });
            res.status(201).json(user);
        } catch (error) {
            const userId = await updateToken(refreshToken, res);
            const user = await User.findOne({ _id: userId });
            res.status(201).json(user);
        }
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}


export { signup, login, logout, checkAuth }