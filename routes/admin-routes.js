// Module declarations
const express        = require("express");
const adminRouter = express.Router();
const ensureLogin = require('connect-ensure-login');
const passport = require('passport')

// checkRoles middleware
const checkRoles = require("../auth/checkRoles");

// Models declarations
const Users = require("../models/users");
const Patients = require("../models/patients");


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


// get route for admin homepage
adminRouter.get('/dashboard', (req, res, next) => {
  res.render('admin-dashboard/admin-dashboard', {username: req.user.username});
});

// get route for admin userlist
adminRouter.get('/userlist', (req, res, next) => {
  Users.find()
  .then(users => {
    res.render('admin-dashboard/admin-list-users',{users: users});
  })
  .catch(err => console.log(err))
});

// GET route for admin userlist to delete user
adminRouter.get('/userlist/:id/delete', (req, res, next) => {
   Users.findOneAndDelete(req.params.id)
    .then(user => console.log('user was deleted',user))
   .catch(err => console.log(err))
  });
  
// POST route for admin userlist to delete user
adminRouter.post('/userlist/:id/edit', (req, res, next) => {

  console.log('edit')
 
 });

// POST route for admin userlist
adminRouter.post('admin/id', (req, res, next) => {
 
console.log('test',req.id)
 
});


  // GET route logout
adminRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

  
module.exports = adminRouter;

