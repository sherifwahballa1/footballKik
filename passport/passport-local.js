const passport = require('passport');
const User = require('../models/usersModel');
const flash = require('connect-flash');
const localStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use('local.signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback:  true
    }, async(req, email, password, done) => {
    await User.findOne({ 'email': email}, (err, user) => {
        if(err){
            return done(err);
        }

        if(user){
            return done(null, false, req.flash('User with this email already exists'));
        }

        const newUser = new User();
        newUser.username = req.body.username;
        newUser.fullname = req.body.username;
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(req.body.password);

         newUser.save( (err) => {
             done(null, newUser);
        });

    });

}));



passport.use('local.login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback:  true
    }, (req, email, password, done) => {
    User.findOne({ 'email': email}, (err, user) => {
        if(err){
            return done(err);
        }

        const messages = [];
        if(!user || !user.validUserPassword(password)){
            messages.push('Email not Exists or password not invalid');
            return done(null, false, req.flash('error', messages));
        }

        return done(null, user);
    });
}));