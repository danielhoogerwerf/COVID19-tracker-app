const express        = require("express");
const mobileAppRouter = express.Router();
const ensureLogin = require('connect-ensure-login');
const passport = require('passport')


// GET route Login page app
mobileAppRouter.get('/', (req, res, next) => {
    res.render('app/app-login');
  });
  
// POST route Login page app
mobileAppRouter.post(
    '/',
    passport.authenticate('local', {
      successRedirect: '/app/home',
      failureRedirect: '/app',
      failureFlash: true,
      passReqToCallback: true
    })
  );

// GET route SignUp page
mobileAppRouter.get('/home',(req, res, next) => {
  console.log('test')
  res.render('app/app-home');
});

// GET route SignUp page
mobileAppRouter.get('/signup', ensureLogin.ensureLoggedIn(),(req, res, next) => {
    res.render('app/app-signup-patient');
  });

  
// GET logout route
mobileAppRouter.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
  });

module.exports = mobileAppRouter;