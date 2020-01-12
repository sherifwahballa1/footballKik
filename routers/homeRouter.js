const express = require('express');
const homeController = require('./../controllers/homeController');

const router = express.Router();

router.get('/home', homeController.homePage);
router.post('/home', homeController.postHomePage);
router.get('/logout', homeController.logout);

module.exports = router;
