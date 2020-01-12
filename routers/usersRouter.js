const express = require('express');
const passport = require('passport');
const usersController = require('./../controllers/usersController');
const userHelper = require('./../helpers/userHelper');

const router = express.Router();
router.get('/', usersController.indexPage);
router.get('/signup', usersController.getSignup);
router.get('/auth/facebook', passport.authenticate('facebook', {scope:"email"}));
router.get('/auth/facebook/callback', passport.authenticate('facebook', 
{ successRedirect: '/home', failureRedirect: '/signup' }));

// router.get('/auth/twitter', passport.authenticate('twitter', {scope:"email"}));
// router.get('/auth/twitter/callback',
//     passport.authenticate('twitter', { successRedirect: '/home',
//     failureRedirect: '/signup' }));

router.get('/auth/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/userinfo.email'
  ] 
}));
router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/home',
    failureRedirect: '/signup'
  }));


router.post('/signup', userHelper.SignUpValidation, usersController.postSignup);
router.post('/', userHelper.LoginValidation, usersController.postLogin);

module.exports = router;
