'use strict';

const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const translateController = require('../controllers/translateController');
const usersController = require('../controllers/usersController');

router.get('/', usersController.show);

router.get('/login', (req, res) => {
    let id = req.session.userId;
    if (id) {
        res.redirect('/');
    } else {
        res.render('login');
    }
});

router.get('/signup', (req, res) => {
    let id = req.session.userId;
    if (id) {
        res.redirect('/');
    } else {
        res.render('signup');
    }
});

router.post('/chat', chatController.handleChat);
router.get('/translate/:word', translateController.translateWord);

module.exports = router;