import express, { response } from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 5000;
app.use(express.json())

// ============ WithOut LanChain ================

// const ai = new GoogleGenAI({
//     apiKey: process.env.GEMINI_API_KEY,
// });

// app.post("/ai", async (req, res) => {
//     try {
//         const { input } = req.body;

//         if (!input || input.trim() === "") {
//             return res.status(400).json({
//                 message: "Input is required",
//             });
//         }

//         const response = await ai.models.generateContent({
//             model: "gemini-3.5-flash-lite",
//             contents: input,
//         });
//         res.status(200).json({
//             message: "Data Successfully",
//             response: response.text,
//         });

//     } catch (error) {
//         console.log("Error:", error.message);

//         res.status(503).json({
//             message: "AI service is temporarily unavailable. Please try again.",
//         });
//     }
// });

// ===========================================

// =================== With Langchain ========================

import { ChatGroq } from "@langchain/groq"

const llm = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0.7,
})

app.post("/ai", async (req, res) => {
    const { input } = req.body;

    const responce = await llm.invoke(input);

    res.status(201).json({ message: "Successfully Data", response: responce.content })
});



// ===========================================



app.get("/", (req, res) => {
    res.json({
        message: "Hello AI Full Course",
    });
});

app.listen(PORT, () => {
    console.log(`Server Connected on Port ${PORT}`);
});