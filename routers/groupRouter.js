const express = require('express');
const groupController = require('./../controllers/groupController');
const homeController = require('../controllers/homeController');

const router = express.Router();

router.get('/group/:name', groupController.groupPage);
router.post('/group/:name', groupController.groupPostPage);
router.get('/logout', homeController.logout);

module.exports = router;