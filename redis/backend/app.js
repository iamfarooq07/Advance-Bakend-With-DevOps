import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import { redis } from "./src/config/redis.js"; // Route ya controller me use karne ke liye import kar sakte hain

dotenv.config();

const app = express();
const PORT = 5000;

// Body Parser Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.send("Hello World");
});

// app.use(route);

app.post("/create", async (req, res) => {
    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000);

    const key = `otp:${email}`;

    const sendOtp = await redis.set(key, otp, "EX", 60);

    return res.status(200).json({ message: "OTP sent successfully", otp, sendOtp });
});

app.post("/verify", async (req, res) => {
    const { email, otp } = req.body;

    const key = `otp:${email}`;

    const cachedOtp = await redis.get(key);

    if (!cachedOtp) {
        return res.status(409).json({
            message: "OTP Not Found"
        });
    }

    if (cachedOtp !== String(otp)) {
        return res.status(401).json({
            message: "OTP Not Match"
        });
    }

    await redis.del(key);

    return res.status(200).json({
        message: "Verification successful"
    });
});

// Start Server
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running on port ${PORT}`);
});