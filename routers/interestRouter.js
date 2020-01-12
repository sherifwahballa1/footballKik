const express = require('express');
const interestController = require('./../controllers/interestController');

const router = express.Router();

router.get('/settings/interests', interestController.getInterestPage);
router.post('/settings/interests', interestController.postInterestPage);

module.exports = router;
