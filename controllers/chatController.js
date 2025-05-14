const gptModel = require("../models/openAiModel");
const controller = {};

controller.handleChat = async (req, res) => {
    const userMessage = req.body.message;
    if (!userMessage) return res.status(400).json({ error: "No message provided" });
    try {
        const reply = await gptModel.askGPT(userMessage);
        res.json({ reply });
    } catch (err) {
        console.error("GPT API Error:", err);
        res.status(500).json({ reply: "Sorry, something went wrong." });
    };
};

module.exports = controller;