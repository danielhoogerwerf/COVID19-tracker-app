// Module declarations
const express = require("express");
const mobileAppRouter = express.Router();
const ensureLogin = require("connect-ensure-login");
const bcrypt = require("bcrypt");
const passport = require("passport");

// checkRoles middleware
const checkRoles = require("../auth/checkRoles");

// Models declarations
const User = require("../models/users");
const BSN = require("../models/bsn");
const Patients = require("../models/patients");

// ## LOGIN PROCESS ##

// GET route Login page app
mobileAppRouter.get("/", (req, res, next) => {
  res.render("app/app-login", { message: req.flash("error") });
});

// POST route Login page app
mobileAppRouter.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/app/home",
    failureRedirect: "/app",
    failureFlash: true,
  })
);

// ## HOME SCREEN ##

// GET route home page
mobileAppRouter.get("/home", ensureLogin.ensureLoggedIn("/app"), (req, res, next) => {
  res.render("app/app-home");
});

// ## SIGN UP PROCESS ##

// GET route Lookup person page
mobileAppRouter.get("/signup/lookup", ensureLogin.ensureLoggedIn("/app"), (req, res, next) => {
  let userRole = { region: req.user.region };
  if (req.user.role === "ADMIN") {
    userRole = {};
  }
  User.find(userRole)
    .then((users) => {
      res.render("app/signup/app-lookup-person", {
        users,
        currentUser: req.user.username,
      });
    })
    .catch((e) => next(e));
});

// POST route Lookup person page
mobileAppRouter.post("/signup/lookup", ensureLogin.ensureLoggedIn("/app"), (req, res, next) => {
  const { name, birthdate } = req.body;
  User.find({})
    .then((users) => {
      res.render("app/signup/app-lookup-person", {
        users,
        currentUser: req.user.username,
      });
    })
    .catch((e) => next(e));
});

// GET route SignUp page
mobileAppRouter.get("/signup/patient", ensureLogin.ensureLoggedIn("/app"), (req, res, next) => {
  res.render("app/signup/app-signup-patient");
});

// POST route SignUp page
let patient;
mobileAppRouter.post("/signup/patient", ensureLogin.ensureLoggedIn("/app"), (req, res, next) => {
  patient = JSON.parse(JSON.stringify(req.body));
  res.render("app/signup/app-signup-confirmation", { patient });
});

// POST route Confirmation page
mobileAppRouter.get("/signup/confirmation", ensureLogin.ensureLoggedIn("/app"), (req, res, next) => {
  // console.log("final result");
  // console.log(req.user.id);
  // console.log(patient.name);
  BSN.create({
    bsnnumber: patient.bsn,
    name: patient.name,
    birthdate: patient.birthdate,
    age: patient.age,
    gender: patient.gender,
  })
    .then((bsn) => {
      Patients.create({
        bsn: bsn._id,
        healthcareworker: req.user.id,
        status: patient.status,
        region: patient.region,
      });
    })
    .then(() => {
      res.render("app/signup/app-signup-registration-complete");
      patient = {};
    })
    .catch((err) => res.render("app/signup/app-signup-registration-fail", { err }));
});

// // GET route Lookup person page with ID
// mobileAppRouter.get("/lookup-person/:id", ensureLogin.ensureLoggedIn("/app"), (req, res, next) => {
//     User.findById(req.params.id)
//       .then(user => {
//         res.render("app/app-lookup-person-results", {
//           user,
//           currentUser: req.user.username
//         });
//       })
//       .catch(e => next(e));
// });

// ## LOOKUP PATIENT PROCESS ##

// GET route Lookup patient page
mobileAppRouter.get("/lookup-patient", ensureLogin.ensureLoggedIn("/app"), (req, res, next) => {
  res.render("app/app-lookup-patient");
});

// POST route Lookup patient page
mobileAppRouter.post("/lookup-patient", ensureLogin.ensureLoggedIn("/app"), (req, res, next) => {
  if (succes) {
    res.render("app/app-selected-patient");
  } else {
    console.log("patient not found");
  }
});

// ## LOGOUT PROCESS ##

// GET logout route
mobileAppRouter.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = mobileAppRouter;
