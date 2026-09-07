import express from "express"
import { createUser, getRedis, getUser } from "../controllers/redis.controller.js";
import { ipMiddleware } from "../middleware/ip.js"

export const route = express.Router();

route.post("/create", ipMiddleware, createUser);
route.get("/get", getUser);
route.get("/redis", getRedis);