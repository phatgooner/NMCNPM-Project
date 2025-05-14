'use strict';

const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const translateController = require('../controllers/translateController');

router.get('/', (req, res) => {
    res.render("index")
});

router.post('/chat', chatController.handleChat);
router.get('/translate/:word', translateController.translateWord)

module.exports = router;