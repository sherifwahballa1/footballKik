const express = require('express');
const overviewController = require('./../controllers/overviewController');

const router = express.Router();

router.get('/profile/:name', overviewController.getOverviewPage);
//router.post('/profile/:name', overviewController.getOverviewPostPage);

module.exports = router;
