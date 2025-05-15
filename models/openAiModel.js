const axios = require("axios");
const gptModel = {};

gptModel.askGPT = async (message) => {
    const prompt = `You are an English learning assistant. After answering, suggest 3 related questions that the learner can ask next. Start with the word "Question:". 
    User: ${message}`;

    const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
        }
    );
    const answer = response.data.choices[0].message.content;

    // Cắt phần gợi ý ra
    const [reply, ...suggestions] = answer.split("Question:");
    return {
        reply: reply.trim(),
        suggestions: suggestions.join("\n").trim(),
    };
};

module.exports = gptModel;
