import jwt from "jsonwebtoken";
import Session from "../model/session.model.js";

const generateAccessToken = (userId, res) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN, {
        expiresIn: "30m"
    });
    res.cookie("accessToken", accessToken, {
        maxAge: 30 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict"
    });
    return accessToken;
}

const generateRefreshToken = (userId, res) => {
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN, {
        expiresIn: "7d"
    });
    res.cookie("refreshToken", refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict"
    });
    return refreshToken;
}

const updateToken = async (refreshToken, res) => {
    const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
    const storedToken = await Session.findOne({ userId: decode.userId });
    if (refreshToken != storedToken.refreshToken)
        throw new Error("No Authintication!")
    generateAccessToken(decode.userId, res)
    return decode.userId;
}


export { generateAccessToken, generateRefreshToken, updateToken }