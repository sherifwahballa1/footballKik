const express = require('express');
const passport = require('passport');
const usersController = require('./../controllers/usersController');
const adminController = require('./../controllers/adminController');
const userHelper = require('./../helpers/userHelper');

const router = express.Router();
router.get('/dashboard', adminController.adminPage);
router.post('/uploadFile', adminController.uploadUserPhoto, adminController.resizeUserPhoto);
router.post('/dashboard', adminController.adminPostPage);



module.exports = router;
