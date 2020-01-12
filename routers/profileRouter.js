const express = require('express');
const profileController = require('./../controllers/profileController');
const router = express.Router();

router.get('/settings/profile', profileController.getProfilePage);

//router.post('/userUpload', profileController.uploadUserPhoto, profileController.resizeUserPhoto);
router.post('/settings/profile', profileController.uploadUserPhoto, profileController.resizeUserPhoto, profileController.postProfilePage);
module.exports = router;