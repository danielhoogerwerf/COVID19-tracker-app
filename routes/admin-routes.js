// Module declarations
const express = require("express");
const adminRouter = express.Router();
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");
const moment = require("moment");

// checkRoles middleware
const checkRoles = require("../auth/checkRoles");
const generatePassword = require("../auth/generatePassword");
const mailPassword = require("../auth/mailPassword");

// Models declarations
const Users = require("../models/users");
const Patients = require("../models/patients");
const BSN = require("../models/bsn");

// variable declarations
const roles = Users.schema.path("role").enumValues;
const region = Users.schema.path("region").enumValues;
const checkAdmin = checkRoles("ADMIN");

// GET route for admin loginpage
adminRouter.get("/", (req, res, next) => {
  res.render("admin-dashboard/admin-login", { message: req.flash("error") });
});

// POST route for admin loginpage

adminRouter.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/admin/home",
    failureRedirect: "/admin",
    failureFlash: true,
    passReqToCallback: true,
  })
);

// GET route for admin homepage
adminRouter.get("/home", ensureLogin.ensureLoggedIn("/"), (req, res, next) => {
  res.render("admin-dashboard/admin-home", {
    currentUser: req.user.username,
    admin: req.user.role,
    message: req.flash("error"),
  });
});

// get route for admin Dashboard
adminRouter.get("/dashboard", ensureLogin.ensureLoggedIn("/"), (req, res, next) => {
  res.render("admin-dashboard/admin-dashboard", { currentUser: req.user.username, admin: req.user.role });
});

// get route for admin userlist
adminRouter.get("/userlist", ensureLogin.ensureLoggedIn("/"), checkAdmin, (req, res, next) => {
  Users.find()
    .then((users) => {
      // format date fields table
      users.forEach((value) => {
        let date = moment(value.createdAt).format("MMMM Do YYYY, h:mm:ss a");
        value["regDate"] = date;
      });
      res.render("admin-dashboard/admin-list-users", {
        users: users,
        currentUser: req.user.username,
        admin: req.user.role,
        message: req.flash("error"),
      });
    })
    .catch((err) => console.log(err));
});

// GET route for admin userlist to delete user
adminRouter.get("/userlist/:id/delete", ensureLogin.ensureLoggedIn("/"), (req, res, next) => {
  Users.findByIdAndDelete(req.params.id)
    .then((user) => {
      console.log("user was deleted", user);
      res.redirect("/admin/userlist");
    })
    .catch((err) => console.log(err));
});

// GET route for admin userlist to edit user
adminRouter.get("/userlist/:id/edit", ensureLogin.ensureLoggedIn("/"), (req, res, next) => {
  Users.findById(req.params.id)
    .then((user) => {
      res.render("admin-dashboard/admin-list-users-edit", {
        user: user,
        roles: roles,
        region: region,
        currentUser: req.user.username,
        admin: req.user.role,
      });
    })
    .catch((err) => console.log(err));
});

// POST route for admin userlist to edit user
adminRouter.post("/userlist/:id/update", ensureLogin.ensureLoggedIn("/"), (req, res, next) => {
  Users.findOneAndUpdate({ _id: req.params.id }, { role: req.body.role, region: req.body.region }, { new: true })
    .then((user) => {
      const updateMessage = `The records of the user ${user.username} were updated`;
      res.render("admin-dashboard/admin-list-users-edit", {
        user: user,
        roles: roles,
        region: region,
        updateMessage: updateMessage,
        currentUser: req.user.username,
        admin: req.user.role,
      });
    })
    .catch((err) => console.log(err));
});

// GET route for admin userlist to mail password to a user
adminRouter.get("/userlist/:id/mail", ensureLogin.ensureLoggedIn("/"), (req, res, next) => {
  Users.findById(req.params.id)
    .then((user) => {
      // async..await is not allowed in global scope, must use a wrapper
      mailPassword(req.params.id, user.username).catch(console.error);
      res.render("admin-dashboard/admin-list-mail-sended", {
        mailUser: user.username,
        currentUser: req.user.username,
        admin: req.user.role,
        message: req.flash("error"),
      });
    })
    .catch((err) => console.log(err));
});

// GET route if acces denied
adminRouter.get("/acces-denied", ensureLogin.ensureLoggedIn("/"), (req, res, next) => {
  res.render("admin-dashboard/admin-acces-denied", {
    currentUser: req.user.username,
    admin: req.user.role,
    message: req.flash("error"),
  });
});

// ## ADD A USER PROCESS ##

// GET route to add a user
adminRouter.get("/userlist/add-user", ensureLogin.ensureLoggedIn("/"), (req, res, next) => {
  res.render("admin-dashboard/admin-list-users-add", {
    currentUser: req.user.username,
    admin: req.user.role,
    roles: roles,
    region: region,
  });
});

// POST route to add a user
adminRouter.post("/userlist/add-user", ensureLogin.ensureLoggedIn("/"), (req, res, next) => {
  if (req.body.username === "") {
    res.render("admin-dashboard/admin-list-users-add", {
      currentUser: req.user.username,
      admin: req.user.role,
      roles: roles,
      region: region,
      errorMessage: "Please provide a emailadress to sign up",
    });
    return;
  }

  const password = generatePassword();

  Users.findOne({ username: req.body.username })
    .then((user) => {
      if (user !== null) {
        res.render("admin-dashboard/admin-list-users-add", {
          currentUser: req.user.username,
          admin: req.user.role,
          roles: roles,
          region: region,
          errorMessage: "This username already exists!",
        });
        return;
      }
      Users.create({
        username: req.body.username,
        password: password.hash,
        region: req.body.region,
        role: req.body.role,
      }).then((user) => {
        console.log("user created: ", user);
        const saveMessage = `The records of user ${user.username} was added`;
        res.render("admin-dashboard/admin-list-users-add", {
          currentUser: req.user.username,
          admin: req.user.role,
          saveMessage: saveMessage,
          roles: roles,
          region: region,
        });
      });
    })
    .catch((err) => console.log(err));
});

// GET route for list patients
adminRouter.get("/patientlist", ensureLogin.ensureLoggedIn("/"), (req, res, next) => {
  Patients.find()
    .populate("bsn")
    .populate("healthcareworker")
    .then((patients) => {
      // format date fields table
      patients.forEach((value) => {
        let date = moment(value.createdAt).format("MMMM Do YYYY, h:mm:ss a");
        let birthdate = moment(value.bsn[0].birthdate).format("MMMM Do YYYY");
        value["regDate"] = date;
        value["birthDate"] = birthdate;
      });
      res.render("admin-dashboard/admin-list-patients", {
        patients,
        currentUser: req.user.username,
        admin: req.user.role,
        message: req.flash("error"),
      });
    })
    .catch((err) => console.log(err));
});

// GET route logout
adminRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/admin");
});

module.exports = adminRouter;
