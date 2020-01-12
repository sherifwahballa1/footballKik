const express = require('express');
const resultController = require('./../controllers/resultController');
const router = express.Router();

router.get('/results', resultController.getResults);
router.post('/results', resultController.postResults);

module.exports = router;