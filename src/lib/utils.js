import jwt from "jsonwebtoken";

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

const updateToken = (userId, refreshToken, storedToken, res) => {
    const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN)
    if (decode.userId != userId || refreshToken != storedToken)
        throw new Error("No Authintication!")
    generateAccessToken(userId, res)
}


export { generateAccessToken, generateRefreshToken, updateToken }