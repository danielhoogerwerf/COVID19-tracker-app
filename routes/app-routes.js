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

// GET route home page
mobileAppRouter.get('/home', ensureLogin.ensureLoggedIn(),(req, res, next) => {
   res.render('app/app-home');
});

// GET route Lookup person page
mobileAppRouter.get('/lookup-person', ensureLogin.ensureLoggedIn(),(req, res, next) => {
  res.render('app/app-lookup-person');
});

// POST route Lookup person page
mobileAppRouter.get('/lookup-person', ensureLogin.ensureLoggedIn(),(req, res, next) => {
  res.render('app-signup-confirmation');
});

// GET route Lookup patient page
mobileAppRouter.get('/lookup-patient', ensureLogin.ensureLoggedIn(),(req, res, next) => {
  res.render('app/app-lookup-patient');
});

// POST route Lookup patient page
mobileAppRouter.post('/lookup-patient', ensureLogin.ensureLoggedIn(),(req, res, next) => {
    if (succes) {  
  res.render('app/app-selected-patient');
  }
  else{
console.log('patient not found')
  }
});


// GET route SignUp page
mobileAppRouter.get('/signup', ensureLogin.ensureLoggedIn(),(req, res, next) => {
    res.render('app/app-signup-patient');
  });

// POST route SignUp page
mobileAppRouter.post('/signup', ensureLogin.ensureLoggedIn(),(req, res, next) => {
  res.render('app/app-signup-confirmation');
});

// GET route Confirmation page
mobileAppRouter.get('/confirmation', ensureLogin.ensureLoggedIn(),(req, res, next) => {
  res.render('app/app-signup-confirmation');
});

// POST route Confirmation page
mobileAppRouter.post('/confirmation', ensureLogin.ensureLoggedIn(),(req, res, next) => {
  if (succes) {
  res.render('app/app-signup-registration-complete');
  }
  else {
  res.render('app/app-signup-registration-fail');
  }
});
  
// GET logout route
mobileAppRouter.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
  });

module.exports = mobileAppRouter;