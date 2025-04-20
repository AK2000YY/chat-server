import { generateAccessToken, generateRefreshToken } from "../lib/utils.js";
import Session from "../model/session.model.js";
import User from "../model/user.model.js";

const trimParams = (inputUser) => {
    const user = {
        userName: inputUser.userName.trim(),
        fullName: {
            firstName: inputUser.fullName.firstName.trim(),
            lastName: inputUser.fullName.lastName.trim()
        },
        email: inputUser.email.trim(),
        password: inputUser.password.trim()
    }
    return user;
}

const validateUser = (user, storedUser) => {
    if (storedUser && user.userName.trim() === storedUser.userName)
        throw new Error("username is used!");
    else if (storedUser && user.email.trim() === storedUser.email)
        throw new Error("email is used!");
    else if (user.password.trim().length < 6)
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
        const storedRefreshToken = await Session.findOne({ userId: user._id })
        if (!storedRefreshToken) {
            const refreshToken = generateRefreshToken(user._id, res);
            await Session.create({ refreshToken, userId: user._id });
        } else {
            res.cookie("refreshToken", storedRefreshToken, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: "strict"
            });
        }
        res.status(201).json({ message: "login is successed!" })
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


export { signup, login, logout }