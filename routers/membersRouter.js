const express = require('express');
const membersController = require('../controllers/membersController');

const router = express.Router();

router.get('/members', membersController.viewMembers);
router.post('/members', membersController.searchMembers);

module.exports = router;