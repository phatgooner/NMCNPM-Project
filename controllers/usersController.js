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

controller.show = (req, res) => {
    let userId = req.session.userId;
    let homepage = true;
    if (!userId) {
        res.render("index", { homepage });
    } else {
        let userList = users.readAll();
        let chatList = chatModel.readAll();
        let chats = [];
        chatList.forEach(chat => {
            if (chat.user_id == userId) {
                chats.push(chat);
            }
        });
        let user = userList.find(item => item.id == userId);
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

module.exports = controller;