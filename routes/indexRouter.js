'use strict';

const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const translateController = require('../controllers/translateController');

router.get('/', (req, res) => {
    let homepage = true;
    res.render("index", { homepage });
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/chat', chatController.handleChat);
router.get('/translate/:word', translateController.translateWord);

module.exports = router;