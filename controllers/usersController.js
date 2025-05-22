'use strict';

const controller = {};
const users = require('../models/user');
const chatModel = require("../models/chat");

// Xử lý đăng nhập người dùng => thành công thì trả về chuỗi JSON người dùng
controller.login = (req, res) => {
    let reqUser = req.body;
    let userList = users.readAll();
    let result = { isUser: false };
    let user = userList.find(item => item.email == reqUser.email
        && item.password == reqUser.password)
    if (user) {
        result = JSON.parse(JSON.stringify(user));
        result.isUser = true;
        req.session.userId = user.id;
    }
    let jsonString = JSON.stringify(result);
    res.send(jsonString);
};

// Xử lý tạo tài khoản người dùng => Thành công thì tạo tập tin JSON người dùng mới
controller.register = async (req, res) => {
    let { name, email, password, confirmPassword } = req.body; //Kiểm tra bên phía server
    let result = { isUser: false };
    let emailList = users.readAllEmail(); //Đọc tất cả email từ csdl người dùng
    if (!emailList.includes(email) && password === confirmPassword && name != '' && email != '' && password != '') {
        result.isUser = true;
        let user = {
            id: users.newId(),
            name,
            email,
            password,
        }
        try {
            users.createNewUser(user);
            console.log('JSON file created successfully!');
        } catch (err) {
            result.isUser = false;
            console.log(err);
        }
    }
    let jsonString = JSON.stringify(result);
    res.send(jsonString);
};

controller.auth = (req, res, next) => {
    let userId = req.session.userId;
    if (!userId) {
        return res.redirect('/');
    }
    next();
}

controller.show = (req, res) => {
    let userId = req.session.userId;
    let homepage = true;
    if (!userId) {
        res.render("index", { homepage });
    } else {
        let chats = chatModel.findAllByUser(userId);
        let user = users.findOne(userId);
        user.chats = chats;
        res.render("index", { homepage, user });
    }
};

controller.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("Logout error:", err);
            res.status(500).send("Logout error");
        } else {
            res.redirect("/");
        }
    });
};

controller.chat = (req, res) => {
    let chatId = req.params.id;
    let result = chatModel.findOne(chatId);
    if (!result || result.user_id != req.session.userId) {
        res.redirect('/');
    } else {
        let conversations = result.conversation;
        let homepage = true;
        let user = users.findOne(req.session.userId);
        let chats = chatModel.findAllByUser(req.session.userId);
        user.chats = chats;
        res.render('chat', { chats, homepage, user, conversations, chatId });
    }
}

controller.saveMessage = (req, res) => {
    let { chatId, role, message } = req.body;
    let chat = chatModel.findOne(chatId);
    let result = { isSuccess: false };
    if (chat) {
        result.isSuccess = true;
        let conversation = {
            role,
            message
        }
        chat.conversation.push(conversation);
        try {
            chatModel.updatechat(chat);
        } catch (err) {
            result.isSuccess = false;
            console.log(err);
        }
    }
    let jsonString = JSON.stringify(result);
    res.send(jsonString);
};

controller.renameChat = (req, res) => {
    let newName = req.body.title;
    let chatId = req.params.id;
    let chat = chatModel.findOne(chatId);
    let result = { isSuccess: false };
    if (chat) {
        result.isSuccess = true;
        chat.name = newName;
        try {
            chatModel.updatechat(chat);
        } catch (err) {
            result.isSuccess = false;
            console.log(err);
        }
    };
    let jsonString = JSON.stringify(result);
    res.send(jsonString);
};

controller.deleteChat = (req, res) => {
    let chatId = req.params.id;
    let chat = chatModel.findOne(chatId);
    let result = { isSuccess: false };
    if (chat) {
        result.isSuccess = true;
        chat.isDeleted = true;
        try {
            chatModel.updatechat(chat);
        } catch (err) {
            result.isSuccess = false;
            console.log(err);
        }
    };
    let jsonString = JSON.stringify(result);
    res.send(jsonString);
};

controller.createChat = (req, res) => {
    let user = req.body.userMessage;
    let assistant = req.body.assistantMessage;
    let newChat = {
        id: chatModel.newId(),
        user_id: req.session.userId,
        name: "New Chat",
        conversation: [
            {
                role: "user",
                message: user
            },
            {
                role: "assistant",
                message: assistant
            }
        ],
        isDeleted: false
    }
    let result = { isSuccess: true, newChatId: newChat.id };
    try {
        chatModel.createNewChat(newChat);
    } catch (err) {
        result.isSuccess = false;
        console.log(err);
    }
    let jsonString = JSON.stringify(result);
    res.send(jsonString);
}

module.exports = controller;