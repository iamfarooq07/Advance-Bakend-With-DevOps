import { Worker } from "bullmq";
import { redis } from "./src/config/redis.js";
import { sendEmail } from "./src/middleware/sendEmail.js";

const emailWorker = new Worker(
    "emailQueue",
    async (job) => {
        console.log("Job received:", job.name);
        console.log("Job data:", job.data);

        // Actual email sending yahan
        console.log(`Sending email to ${job.data.email}`);

        await sendEmail(job.data.email);

        return {
            success: true,
        };
    },
    {
        connection: redis,
    }
);

emailWorker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

emailWorker.on("failed", (job, err) => {
    console.log(`Job ${job?.id} failed: ${err.message}`);
});