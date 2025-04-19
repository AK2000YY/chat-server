import jwt from "jsonwebtoken";

const generateAccessToken = (id, res) => {
    const accessToken = jwt.sign({ id }, process.env.ACCESS_TOKEN, {
        expiresIn: "30m"
    });
    res.cookie("accessToken", accessToken, {
        maxAge: 30 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict"
    });
    return accessToken;
}

const generateRefreshToken = (id, res) => {
    const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN, {
        expiresIn: "7d"
    });
    res.cookie("refreshToken", refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict"
    });
    return refreshToken;
}

const updateToken = (id, refreshToken, storedToken, res) => {
    const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN)
    if (decode.id != id || refreshToken != storedToken)
        throw new Error("No Authintication!")
    generateAccessToken(id, res)
}