import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { route } from "./src/routes/redis.route.js";
import { connectDB } from "./src/config/db.js";
import { redis } from "./src/config/redis.js"; // Route ya controller me use karne ke liye import kar sakte hain

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Body Parser Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use(route);

// Start Server
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running on port ${PORT}`);
});