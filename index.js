'use strict';
//Khai báo
require("dotenv").config()
const express = require('express');
const app = express();
const port = 3000;
const express_handlebars = require('express-handlebars');

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
    }
}));
app.set('view engine', 'hbs');

//Chuyển hướng sang Router
app.use('/', require('./routes/indexRouter'));

//Khởi động server
app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});