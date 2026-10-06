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
        const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: input,
            config: {
                systemInstruction:
                    "You are a senior backend developer. Explain concepts in simple Roman Urdu with practical JavaScript examples.",
            },
        });

        res.status(200).json({
            message: "Data Successfully",
            response: response.text,
        });

    } catch (error) {
        console.log("Error:", error.message);

        res.status(503).json({
            message: "AI service is temporarily unavailable. Please try again.",
        });
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