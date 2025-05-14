const dictionaryModel = require("../models/dictionaryModel");
const controller = {};

controller.translateWord = async (req, res) => {
    const word = req.params.word;
    try {
        const data = await dictionaryModel.lookupWord(word);
        res.json({ success: true, data });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

module.exports = controller;