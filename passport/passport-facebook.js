const passport = require('passport');
const User = require('../models/usersModel');
const flash = require('connect-flash');
const FacebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(
     new FacebookStrategy({
    clientID: process.env.FB_CLIENTID,
    clientSecret: process.env.FB_CLIENTSECRET,
    profileFields: ['email', 'displayName', 'photos'],
    callbackURL: "http://localhost:3000/auth/facebook/callback"

  },
  function (accessToken, refreshToken, profile, done){
    User.findOne({ facebook: profile.id }, (err, user) => {
        if(err){
            return done(err);
        }

        if(user){
            return done(null, user);
        }else {
            const newUser = new User();
            newUser.facebook = profile.id;
            newUser.fullname = profile.displayName;
            newUser.username = profile.displayName;
            newUser.email = profile._json.email;
            newUser.userImage = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
            newUser.fbToken.push({token:accessToken});
           
            newUser.save((err)=> {
                return done(null, user);
            });
        }
    })
}));

