'use strict';
//Khai báo
require("dotenv").config()
const express = require('express');
const app = express();
const port = 3000;
const express_handlebars = require('express-handlebars');
const session = require('express-session');

//Cấu hình public static folder
app.use(express.static(__dirname + '/public'));

//Cấu hình đọc dữ liệu post từ body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Cấu hình express handlebars
app.engine('hbs', express_handlebars.engine({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    extname: 'hbs',
    defaultLayout: 'layout',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    },
    helpers: {
        eq: (a, b) => a === b,
        highlightWords: (text) => {
            return text.replace(/\b([\p{L}\p{M}]+)\b/gu, (word) => {
                return `<span class="word" onclick="showDefinition('${word}')">${word}</span>`;
            });
        }
    }
}));
app.set('view engine', 'hbs');

//Cấu hình session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 20 * 60 * 1000 //20 phút
    }
}));

//Chuyển hướng sang Router
app.use('/', require('./routes/indexRouter'));
app.use('/users', require('./routes/usersRouter'));

//Bắt lỗi
app.use((req, res, next) => {
    res.status(404).render('error', { message: 'Page Not Found!', status: 404 });
});

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).render('error', { message: 'Internal Server Error!', status: 500 });
});

//Khởi động server
app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});