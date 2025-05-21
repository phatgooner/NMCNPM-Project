const FS = require("fs");
const PATH = require("path");
const dataFolder = "./data";
const userFolder = PATH.join(dataFolder, "users");
const user = {}

user.readAll = () => {
    let userList = [];
    let fileList = FS.readdirSync(userFolder);
    fileList.forEach(fileName => {
        let link = PATH.join(userFolder, fileName);
        let jsonString = FS.readFileSync(link, "utf-8");
        let user = JSON.parse(jsonString);
        userList.push(user);
    })
    return userList;
};

user.readAllEmail = () => {
    let emailList = [];
    let userList = user.readAll();
    userList.forEach(user => {
        emailList.push(user.email);
    });
    return emailList;
}

user.newId = () => {
    let list = user.readAll();
    return list.length + 1;
}

user.createNewUser = (newUser) => {
    FS.writeFile(`${userFolder}/user_${newUser.id}.json`, JSON.stringify(newUser), (err) => {
        if (err) {
            console.error('Error writing file', err);
            return false;
        } else {
            return true;
        }
    });
}

user.updateUser = (user) => {
    FS.writeFile(`${userFolder}/user_${user.id}.json`, JSON.stringify(user), (err) => {
        if (err) {
            console.error('Error writing file', err);
            return false;
        } else {
            return true;
        }
    });
};

user.findOne = (userId) => {
    let userList = user.readAll();
    let result = userList.find(item => item.id == userId);
    return result;
}

module.exports = user;