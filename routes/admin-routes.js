const express        = require("express");
const adminRouter = express.Router();
const ensureLogin = require('connect-ensure-login');
const passport = require('passport')
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const nodemailer = require('nodemailer');

// checkRoles middleware
const checkRoles = require("../auth/checkRoles");

// Models declarations
const Users = require("../models/users");
const Patients = require("../models/patients");

// variable declarations
const roles = Users.schema.path('role').enumValues
const region = Users.schema.path('region').enumValues



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
  res.render('admin-dashboard/admin-dashboard');
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
     Users.findByIdAndDelete(req.params.id)
    .then(user => {console.log('user was deleted',user)
    res.redirect('/admin/userlist')
})
.catch(err => console.log(err))
  });
  
// GET route for admin userlist to edit user
adminRouter.get('/userlist/:id/edit', (req, res, next) => {
Users.findById(req.params.id)
.then(user => {
  res.render('admin-dashboard/admin-list-users-edit',{user: user,roles:roles,region:region})
})
.catch(err => console.log(err))
 });

// GET route for admin userlist to mail password to a user
adminRouter.get('/userlist/:id/mail', (req, res, next) => {
  Users.findById(req.params.id)
 .then(user => {
  // async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass // generated ethereal password
    }
  });
console.log(user.username)
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: 'fhoman@gmail.com', // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>" // html body
  });
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

main().catch(console.error);

})
.catch(err => console.log(err))
});

// GET route to add a user
adminRouter.get('/userlist/add-user', (req, res, next) => { 
  res.render('admin-dashboard/admin-list-users-add',{roles:roles,region:region});
 });

// POST route to add a user
adminRouter.post('/userlist/add-user', (req, res, next) => { 
const randomPassword = Math.random().toString(36).slice(-8);
const salt     = bcrypt.genSaltSync(bcryptSalt);
const hashPass = bcrypt.hashSync(randomPassword, salt);
console.log(randomPassword)
Users.create({username: req.body.username,
              password:hashPass,
              region: req.body.region,
              role: req.body.role})
.then(user => {console.log('user created: ',user)
res.redirect('/admin/userlist');
})
.catch(err => console.log(err))
 });

  // GET route logout
adminRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

  
module.exports = adminRouter;

