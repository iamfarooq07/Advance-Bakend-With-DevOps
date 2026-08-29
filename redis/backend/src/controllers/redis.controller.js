import { redis } from "../config/redis.js";
import { User } from "../models/user.model.js";

export const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await User.create({ name, email, password });

        // Cache clear karein taake next GET fresh data laye
        await redis.del("user-all");

        return res.status(201).json({ message: "User Created Successfully", user });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getUser = async (req, res) => {
    try {
        const user = await User.find({});
        return res.json({ message: "User Get", user });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getRedis = async (req, res) => {
    try {
        const cachedData = await redis.get("user-all");

        // Cache Hit
        if (cachedData) {
            return res.status(200).json({
                message: "Data retrieved from Redis Database",
                data: JSON.parse(cachedData),
            });
        }

        // Cache Miss -> DB se layein
        const users = await User.find({});

        // Redis mein save karein (60 seconds expiry ke sath)
        await redis.set("user-all", JSON.stringify(users), "EX", 60);

        return res.status(200).json({
            message: "Data retrieved from MongoDB Database",
            data: users,
        });
    } catch (error) {
        console.error("Error in /redis route:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};