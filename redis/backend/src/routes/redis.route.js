import express from "express"
import { createUser, getRedis, getUser } from "../controllers/redis.controller.js";

export const route = express.Router();

route.post("/create", createUser);
route.get("/get", getUser);
route.get("/redis", getRedis);