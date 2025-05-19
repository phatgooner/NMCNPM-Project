'use strict';

const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const translateController = require('../controllers/translateController');

router.post('/chat', chatController.handleChat);
router.get('/translate/:word', translateController.translateWord);

router.get('/', (req, res) => {
    res.render("index")
});

router.get('/:page', (req, res) => {
    let page = req.params.page;
    res.render(`${page}`);
});

module.exports = router;