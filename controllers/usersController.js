const passport = require('passport');
module.exports.indexPage = (req, res) => {
    const errors = req.flash('error');
    return res.render('index', {
        title: 'FootballKik | Login',
        messages: errors,
        hasErrors: errors.length > 0
    });
};

module.exports.getSignup = (req, res) => {
    const errors = req.flash('error');
    return res.render('signup', {
        title: 'FootballKik | Signup',
        messages: errors,
        hasErrors: errors.length > 0
     });
};


module.exports.postSignup = passport.authenticate('local.signup', {
    successRedirect: '/home',
    failureRedirect: '/signup',
    failureFlash: true
});


module.exports.postLogin = passport.authenticate('local.login', {
    successRedirect: '/home',
    failureRedirect: '/',
    failureFlash: true
});
