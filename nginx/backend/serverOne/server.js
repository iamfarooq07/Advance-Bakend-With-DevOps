import express from "express";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
    res.status(201).json({ message: "Server One is Running" })
})
app.get("/admin", (req, res) => {
    res.status(201).json({ message: "Hello Admin Server One" })
})

app.listen(PORT, () => {
    console.log(`Server One Is Running on Port ${PORT}`);
})
