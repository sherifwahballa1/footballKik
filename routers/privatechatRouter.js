const express = require('express');
const privatechatController = require('./../controllers/privatechatController');

const router = express.Router();

router.get('/chat/:name', privatechatController.getchatPage);
router.post('/chat/:name', privatechatController.chatPostPage);

module.exports = router;
