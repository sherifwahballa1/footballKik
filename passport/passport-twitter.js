const  passport = require('passport')
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/usersModel');
const Secret = require('./../secret/secretFile');
const flash = require('connect-flash');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new TwitterStrategy({
    consumerKey: Secret.google.clientID,
    consumerSecret: Secret.google.clientSecret,
    callbackURL: "http://localhost:3000/auth/twitter/callback"
  },
  function (token, tokenSecret, profile, done){
    User.findOne({ twitter: profile.id }, (err, user) => {
        if(err){
            return done(err);
        }

        if(user) {
            return done(null, user);
        }else {
            console.log(profile, token, tokenSecret);
            // const newUser = new User();
            // newUser.twiiter = profile.id;
            // newUser.fullname = profile.displayName;
            // newUser.email = profile.emails[0].value;
            // newUser.userImage = profile._json.image.url;

            // newUser.save((err)=>{
            //     if(err){
            //         return done(err);
            //     }
            //     return done(null, newUser);
            // });
        }
    })
}));

