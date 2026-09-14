import { Queue } from "bullmq";
import { redis } from "./src/config/redis.js";

export const emailQueue = new Queue("emailQueue", { connection: redis });
