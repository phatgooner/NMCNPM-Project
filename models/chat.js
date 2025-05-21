const FS = require("fs");
const PATH = require("path");
const dataFolder = "./data";
const chatFolder = PATH.join(dataFolder, "chats");
const chat = {}

chat.readAll = () => {
    let chatList = [];
    let fileList = FS.readdirSync(chatFolder);
    fileList.forEach(fileName => {
        let link = PATH.join(chatFolder, fileName);
        let jsonString = FS.readFileSync(link, "utf-8");
        let chat = JSON.parse(jsonString);
        chatList.push(chat);
    })
    return chatList;
};

chat.newId = () => {
    let list = chat.readAll();
    return list.length + 1;
}

chat.createNewChat = (newChat) => {
    FS.writeFile(`${chatFolder}/chat_${newChat.id}.json`, JSON.stringify(newChat), (err) => {
        if (err) {
            console.error('Error writing file', err);
            return false;
        } else {
            return true;
        }
    });
}

chat.updatechat = (chat) => {
    FS.writeFile(`${chatFolder}/chat_${chat.id}.json`, JSON.stringify(chat), (err) => {
        if (err) {
            console.error('Error writing file', err);
            return false;
        } else {
            return true;
        }
    });
}

chat.findAllByUser = (userId) => {
    let chatList = chat.readAll();
    let chats = [];
    chatList.forEach(item => {
        if (item.user_id == userId && item.isDeleted == false) {
            chats.push(item);
        }
    });
    return chats;
};

chat.findOne = (chatId) => {
    let chatList = chat.readAll();
    let result = chatList.find(item => item.id == chatId && item.isDeleted == false);
    return result;
}

module.exports = chat;