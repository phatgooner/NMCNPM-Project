const axios = require("axios");
const gptModel = {};

gptModel.askGPT = async (userMessage) => {
    const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful English learning assistant." },
                { role: "user", content: userMessage },
            ],
            temperature: 0.7, // Điều chỉnh độ sáng tạo
            max_tokens: 1000,  // Giới hạn độ dài phản hồi
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
        }
    );
    return response.data.choices[0].message.content.trim();
};

module.exports = gptModel;
