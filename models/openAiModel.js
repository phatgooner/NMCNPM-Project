const axios = require("axios");
const gptModel = {};

gptModel.askGPT = async (message) => {
    const prompt = `You are an English learning assistant. After answering, suggest 3 related questions for the learner that the learner can ask next. Start with the word "Question:". 
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

gptModel.translate = async (word) => {
    const prompt = `Bạn là 1 từ điển Anh-Việt. Bạn hãy dịch cho tôi từ "${word}" sang tiếng việt và trả về kết quả ở dạng JSON như sau:
    {
    "word": "${word}",
    "phonetic": {
            "text": "/dạng phát âm của từ đó/",
            "audio": "${word}"
    },
    "meanings": [
        {
            "partOfSpeech": "loại từ của từ đó bằng tiếng việt (ví dụ: danh từ, động từ,...)",
            "definitions": [ //Tìm cho tôi tất cả nghĩa của từ này và đưa vào mảng
                {
                    "definition": "Nghĩa của từ bằng tiếng việt",
                    "synonyms": ["tìm cho tôi danh sách các từ đồng nghĩa với nghĩa này bằng tiếng anh và điền vào mảng"],
                    "antonyms": ["tìm cho tôi danh sách các từ trái nghĩa với nghĩa này bằng tiếng anh và điền vào mảng"],
                    "example": "Cho 1 ví dụ tiếng anh liên quan đến nghĩa này của từ. Sau đó dịch ví dụ này sang tiếng việt trong ngoặc đơn"
                },
                //Nếu có nhiều nghĩa khác
                {
                    "definition": "Nghĩa thứ 2 của từ bằng tiếng việt",
                    "synonyms": ["tìm cho tôi danh sách các từ đồng nghĩa với nghĩa này bằng tiếng anh và điền vào mảng"],
                    "antonyms": ["tìm cho tôi danh sách các từ trái nghĩa với nghĩa này bằng tiếng anh và điền vào mảng"],
                    "example": "Cho 1 ví dụ tiếng anh liên quan đến nghĩa này của từ. Sau đó dịch ví dụ này sang tiếng việt trong ngoặc đơn"
                },
                ...                
            ]
        }
    ]
}`;

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
    return response.data.choices[0].message.content;
}

module.exports = gptModel;
