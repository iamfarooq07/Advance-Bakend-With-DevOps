// import express from "express";
// import dotenv from "dotenv";
// import { redis } from "./src/config/redis.js";
// import { connectDB } from "./src/config/db.js";

// dotenv.config()

// const app = express();
// app.use(express.json());

// const KEY_REDIS = "value:all"


// app.post("/post-redis", async (req, res) => {
//     const user = await redis.set("value:all", req.body);

//     res.json({
//         message: "Successfully Done",
//         user,
//     });
// });

// app.get("/get-redis", async (req, res) => {
//     const user = await redis.get("value:all")
//     res.json({
//         message: "Successfully Done",
//         user,
//     });

// })

// app.get("/ping", async (req, res) => {
//     const result = await redis.expire(KEY_REDIS, 60);

//     res.json({
//         message: "Pong Done",
//         redis: result
//     });
// })

// connectDB()
// app.listen(3001, () => {
//     console.log(`server Connected on Port 3000`);
// })