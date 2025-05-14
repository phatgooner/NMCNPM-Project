const axios = require("axios");
const https = require("https");
const dictModel = {};

// Tạo agent để buộc dùng IPv4
const agent = new https.Agent({ family: 4 });

dictModel.lookupWord = async (word) => {
    try {
        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, { httpsAgent: agent });
        return response.data;
    } catch (err) {
        throw new Error("Word not found or API failed.");
    }
};

module.exports = dictModel;

