// Module declarations
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
const checkAdmin  = checkRoles('ADMIN');


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
  adminRouter.get('/home',ensureLogin.ensureLoggedIn("/"), (req, res, next) => {
       res.render('admin-dashboard/admin-home',{currentUser:req.user.username,admin:req.user.role,message: req.flash("error")});
  });

// get route for admin Dashboard
adminRouter.get('/dashboard',ensureLogin.ensureLoggedIn("/"), (req, res, next) => {
   res.render('admin-dashboard/admin-dashboard',{currentUser:req.user.username,admin:req.user.role});
});

// get route for admin userlist
adminRouter.get('/userlist',ensureLogin.ensureLoggedIn("/"),checkAdmin,(req, res, next) => {
  Users.find()
  .then(users => {
   
    res.render('admin-dashboard/admin-list-users',{users: users,currentUser:req.user.username,admin:req.user.role,message: req.flash("error")});
  })
  .catch(err => console.log(err))
});

// GET route for admin userlist to delete user
adminRouter.get('/userlist/:id/delete',ensureLogin.ensureLoggedIn("/"), (req, res, next) => {
     Users.findByIdAndDelete(req.params.id)
    .then(user => {console.log('user was deleted',user)
    res.redirect('/admin/userlist')
})
.catch(err => console.log(err))
  });
  
// GET route for admin userlist to edit user
adminRouter.get('/userlist/:id/edit',ensureLogin.ensureLoggedIn("/"), (req, res, next) => {
Users.findById(req.params.id)
.then(user => {
  
  res.render('admin-dashboard/admin-list-users-edit',{user: user,roles:roles,region:region,currentUser:req.user.username,admin:req.user.role})
})
.catch(err => console.log(err))
 });


// POST route for admin userlist to edit user
adminRouter.post('/userlist/:id/update',ensureLogin.ensureLoggedIn("/"), (req, res, next) => {
Users.findOneAndUpdate(
   {_id:req.params.id},
    {role:req.body.role,
    region:req.body.region},
    {new: true})
.then((user) =>   {
const updateMessage = `The records of the user ${user.username} were updated`
res.render('admin-dashboard/admin-list-users-edit',{user: user,roles:roles,region:region,updateMessage:updateMessage,currentUser:req.user.username,admin:req.user.role})
})
.catch(err => console.log(err))
   });
  
// GET route for admin userlist to mail password to a user
adminRouter.get('/userlist/:id/mail',ensureLogin.ensureLoggedIn("/"), (req, res, next) => {
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

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"Friso Homan" ${testAccount.user}`, // sender address
    to: user.username, // list of receivers
    subject: "Your COVI-19 password", // Subject line
    text: `This is your COVI-19 password ${user.password}`, // plain text body
    html: `This is your COVI-19 password ${user.password}` // html body
  });
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
main().catch(console.error);
})
.catch(err => console.log(err))
});


// GET route if acces denied 
adminRouter.get('/acces-denied',ensureLogin.ensureLoggedIn("/"), (req, res, next) => {
   res.render('admin-dashboard/admin-acces-denied',{currentUser:req.user.username,admin:req.user.role,message: req.flash("error")});
});


// ## ADD A USER PROCESS ##

// GET route to add a user
adminRouter.get('/userlist/add-user',ensureLogin.ensureLoggedIn("/"), (req, res, next) => { 
  res.render('admin-dashboard/admin-list-users-add',{currentUser:req.user.username,admin:req.user.role,roles:roles,region:region});
 });

// POST route to add a user
adminRouter.post('/userlist/add-user',ensureLogin.ensureLoggedIn("/"), (req, res, next) => { 

  if (req.body.username === '') {
    res.render('admin-dashboard/admin-list-users-add', {currentUser:req.user.username,admin:req.user.role,roles:roles,region:region,
      errorMessage: 'Please provide a emailadress to sign up'
    });
    return;
  }

const randomPassword = Math.random().toString(36).slice(-8);
const salt     = bcrypt.genSaltSync(bcryptSalt);
const hashPass = bcrypt.hashSync(randomPassword, salt);
console.log('Password user: ',randomPassword)
Users.findOne({username:req.body.username})
.then(user => {
  if (user !== null) {
    res.render('admin-dashboard/admin-list-users-add', {currentUser:req.user.username,admin:req.user.role,roles:roles,region:region,
      errorMessage: 'This username already exists!'
    });
    return;
  }
Users.create({username: req.body.username,
    password:hashPass,
    region: req.body.region,
    role: req.body.role})
.then(user => {console.log('user created: ',user)
const saveMessage = `The records of user ${user.username} was added`
res.render('admin-dashboard/admin-list-users-add',{currentUser:req.user.username,admin:req.user.role,saveMessage:saveMessage,roles:roles,region:region});
})
})
.catch(err => console.log(err))
 });


// GET route for list patients
adminRouter.get('/patientlist',ensureLogin.ensureLoggedIn("/"), (req, res, next) => {
  res.render('admin-dashboard/admin-list-patients',{currentUser:req.user.username,admin:req.user.role,message: req.flash("error")});
});


  // GET route logout
adminRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/admin');
});

  
module.exports = adminRouter;

