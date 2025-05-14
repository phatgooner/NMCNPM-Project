const axios = require("axios");
const https = require("https");

// Tạo agent để buộc dùng IPv4
const agent = new https.Agent({ family: 4 });

exports.lookupWord = async (word) => {
    try {
        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, { httpsAgent: agent });
        return response.data;
    } catch (err) {
        throw new Error("Word not found or API failed.");
    }
};

