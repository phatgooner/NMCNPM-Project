'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/usersController');

router.post('/login', controller.login);
router.get('/logout', controller.logout);
router.post('/register', controller.register);
router.get('/chat/:id', controller.chat);
router.post('/chat/save', controller.saveMessage);
router.post('/chat/rename/:id', controller.renameChat);
router.delete('/chat/delete/:id', controller.deleteChat);

module.exports = router;
