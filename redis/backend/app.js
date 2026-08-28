import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Redis from "ioredis";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Body Parser Middleware
app.use(express.json());

// Redis Connection
const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");

redis.on("connect", () => console.log("Redis Connected"));
redis.on("error", (err) => console.error("Redis Error:", err.message));

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("DB Connected");
    } catch (error) {
        console.error("DB Connection Error:", error);
        process.exit(1);
    }
};

// User Schema & Model
const userSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        password: String,
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

// Routes
app.get("/", (req, res) => {
    res.send("Hello World");
});

// 1. Create User (And Invalidate Cache)
app.post("/create", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await User.create({ name, email, password });

        // Cache clear karein taake next GET fresh data laye
        await redis.del("user-all");

        return res.status(201).json({ message: "User Created Successfully", user });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// 2. Direct MongoDB Get (Bypassing Redis)
app.get("/get", async (req, res) => {
    try {
        const user = await User.find({});
        return res.json({ message: "User Get", user });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// 3. Cached Redis Get (Cache-Aside Pattern)
app.get("/redis", async (req, res) => {
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
});

// Start Server
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running on port ${PORT}`);
});