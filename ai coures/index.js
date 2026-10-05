import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 5000;
app.use(express.json())
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

app.post("/ai", async (req, res) => {

    try {
        const { input } = req.body;

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: input,
        });

        res.json({ message: "Data Successfully", response })
    } catch (error) {
        console.log("Error", error.message);
    }
});


app.get("/", (req, res) => {
    res.json({
        message: "Hello AI Full Course",
    });
});

app.listen(PORT, () => {
    console.log(`Server Connected on Port ${PORT}`);
});