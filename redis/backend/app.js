import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import { redis } from "./src/config/redis.js";
import { User } from "./src/models/user.model.js";
import { emailQueue } from "./queue.js";

dotenv.config();

const app = express();
const PORT = 5000;

// Body Parser Middleware
app.use(express.json());

// Routes
app.post("/queue", async (req, res) => {
    const { name, email, password } = req.body;

    const users = await User.create({
        name, email, password
    })

    const job = await emailQueue.add("sendEmail", {
        name,
        email,
    });

    res.status(201).json({ message: "Create Successfully", users, job_id: job.id });
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

// Resl Project Redis Used

// import mongoose from "mongoose";
// const userSchemaTwo = new mongoose.Schema({
//     name: String,
//     email: String,
//     password: String
// }, { timestamps: true })
// const UserTwo = mongoose.model("UserTwo", userSchemaTwo);

// app.post("/create-redis", async (req, res) => {
//     const { name, email, password } = req.body;

//     const user = await UserTwo.create({
//         name, email, password
//     });


//     await redis.del("user:all");

//     res.status(201).json({ message: "redis Api Success", user })
// });

// app.get("/get-redis", async (req, res) => {
//     try {
//         // await redis.del("user:all");
//         const redisData = await redis.get("user:all");

//         // Redis HIT
//         if (redisData) {
//             const users = JSON.parse(redisData);

//             return res.status(200).json({
//                 message: "Data From Redis",
//                 users
//             });
//         }

//         // Redis MISS → MongoDB
//         const users = await UserTwo.find({});

//         // MongoDB data → Redis
//         await redis.set(
//             "user:all",
//             JSON.stringify(users)
//         );

//         return res.status(200).json({
//             message: "Data From MongoDB",
//             users
//         });

//     } catch (error) {
//         return res.status(500).json({
//             message: "Server Error",
//             error: error.message
//         });
//     }
// });
// =================
