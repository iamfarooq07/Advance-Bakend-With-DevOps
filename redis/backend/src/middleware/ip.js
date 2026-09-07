import { redis } from "../config/redis.js";

export const ipMiddleware = async (req, res, next) => {
    try {
        const ip = req.ip;
        const key = `ip:id:${ip}`;
        const request = await redis.incr(key);
        if (request === 1) {
            await redis.expire(key, 60);
        }
        if (request > 5) {
            return res.status(429).json({
                message: "Too Many Requests",
            });
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Error",
        });
    }
};
