import jwt from "jsonwebtoken";
import { updateToken } from "../lib/utils.js";

const protect = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken)
            throw new Error("no authentication!");
        try {
            const decodeAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
            req.id = decodeAccessToken.userId;
            next();
        } catch (e) {
            if (e.name === "TokenExpiredError") {
                const refreshToken = req.cookies.refreshToken;
                if (!refreshToken)
                    throw new Error("no authentication!");
                const userId = await updateToken(refreshToken, res);
                req.id = userId;
                next();
            }
        }
    } catch (e) {
        res.status(404).json({ message: e.message });
    }
}


export default protect;