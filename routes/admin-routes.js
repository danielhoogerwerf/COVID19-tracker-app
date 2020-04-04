const express        = require("express");
const adminRouter = express.Router();
const ensureLogin = require('connect-ensure-login');
const passport = require('passport')


// GET route for admin loginpage
adminRouter.get('/', (req, res, next) => {
     res.render('admin-dashboard/admin-login', { message: req.flash('error') });
  });

// POST route for admin loginpage

adminRouter.post(
  '/',
  passport.authenticate('local', {
    successRedirect: '/admin/home',
    failureRedirect: '/admin',
    failureFlash: true,
    passReqToCallback: true
  })
);

// GET route for admin homepage
  adminRouter.get('/home', (req, res, next) => {
    res.render('admin-dashboard/admin-home');
  });

  // GET route logout
adminRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

  
module.exports = adminRouter;

