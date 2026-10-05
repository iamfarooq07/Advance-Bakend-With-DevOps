import express from "express";

const app = express();
const PORT = 5000;

app.get("/success", (req, res) => {
    res.status(201).json({ message: "Payment Successfully Completed" })
})
app.get("/error", (req, res) => {
    res.status(401).json({ message: "Payment Faild" })
})

app.listen(PORT, () => {
    console.log(`Server Two Is Running on Port ${PORT}`);
})
