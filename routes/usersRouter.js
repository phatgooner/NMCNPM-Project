'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/usersController');

router.post('/login', controller.login);
router.get('/logout', controller.logout);
router.post('/register', controller.register);
router.get('/chat/:id', controller.auth, controller.chat);
router.post('/chat/create', controller.auth, controller.createChat);
router.post('/chat/save', controller.auth, controller.saveMessage);
router.post('/chat/rename/:id', controller.auth, controller.renameChat);
router.delete('/chat/delete/:id', controller.auth, controller.deleteChat);

module.exports = router;
