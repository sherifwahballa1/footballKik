const express = require('express');
const newsController = require('./../controllers/newsController');

const router = express.Router();

router.get('/latest-football-news', newsController.footballNews);

module.exports = router;
