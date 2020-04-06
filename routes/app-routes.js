// Module declarations
const express = require("express");
const mobileAppRouter = express.Router();
const ensureLogin = require("connect-ensure-login");
const bcrypt = require("bcrypt");
const passport = require("passport");

// checkRoles middleware
const checkRoles = require("../auth/checkRoles");

// Models declarations
const Users = require("../models/users");
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
  res.render("app/signup/app-signup-lookup-person");
});

// POST route Lookup person page
mobileAppRouter.post("/signup/lookup", ensureLogin.ensureLoggedIn("/app"), (req, res, next) => {
  const { name, birthdate } = req.body;

  BSN.find({ $or: [{ birthdate: birthdate }, { name: { $regex: ".*" + name + ".*", $options: "i" } }] }).then(
    (data) => {
      res.render("app/signup/app-signup-lookup-person-result", { results: data });
    }
  );
});

// GET route Lookup already patient?
mobileAppRouter.get("/signup/lookup/:id", ensureLogin.ensureLoggedIn("/app"), (req, res, next) => {
  let patientIsRegistered
  Patients.find({ bsn: req.params.id })
    .populate("bsn")
    .populate("healthcareworker")
    .then((patientsResults) => {
      patientIsRegistered = patientsResults[0].status;
    })
    .then(() => {
      BSN.findById(req.params.id)
        .then((bsnResults) => {
          if (patientIsRegistered) {
          res.render("app/signup/app-signup-lookup-person-result", { bsnResults, patientIsRegistered });
          } else{
            res.redirect("/app/home")
          }
          //res.send(bsnResults);
        })
        .catch((e) => next(e));
    })
    .catch((e) => next(e));
});

// GET route SignUp page
mobileAppRouter.get("/signup/patient", ensureLogin.ensureLoggedIn("/app"), (req, res, next) => {
  res.render("app/signup/app-signup-patient");
});

// POST route SignUp page
let patient = {};
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

// ## LOOKUP PATIENT PROCESS ##

// GET route Lookup patient page
mobileAppRouter.get("/lookup/patient", ensureLogin.ensureLoggedIn("/app"), (req, res, next) => {
  // res.render("app/lookup/app-lookup-patient");
  let userRole = { region: req.user.region };
  if (req.user.role === "ADMIN") {
    userRole = {};
  }
  Patients.find(userRole)
    .populate("bsn")
    .populate("healthcareworker")
    .then((results) => {
      res.render("app/lookup/app-lookup-patient", {
        results,
        currentUser: req.user.username,
        currentRegion: req.user.region,
      });
    })
    .catch((e) => next(e));
});

// POST route Lookup patient page
mobileAppRouter.post("/lookup/patient", ensureLogin.ensureLoggedIn("/app"), (req, res, next) => {
  const { name, birthdate } = req.body;

  BSN.find({ $or: [{ birthdate: birthdate }, { name: { $regex: ".*" + name + ".*", $options: "i" } }] }).then(
    (data) => {
      res.render("app/lookup/app-lookup-results-patient", { results: data });
    }
  );
});

// GET route Lookup by ID
mobileAppRouter.get("/lookup/patient/:id", ensureLogin.ensureLoggedIn("/app"), (req, res, next) => {
  // Pay attention that the references defined in Patients model match the mongoose.model("") of BSN and User
  Patients.find({ bsn: req.params.id })
    .populate("bsn")
    .populate("healthcareworker")
    .then((data) => {
      res.render("app/lookup/app-selected-patient", { results: data });
      //res.send(data)
    });
});

// GET route Edit Patient
mobileAppRouter.get("/lookup/patient/:id/edit", ensureLogin.ensureLoggedIn("/app"), (req, res, next) => {
  Patients.find({ bsn: req.params.id })
    .populate("bsn")
    .populate("healthcareworker")
    .then((data) => {
      res.render("app/lookup/app-edit-patient", { results: data });
    });
});

// POST route Edit Patient
mobileAppRouter.post("/lookup/patient/:id/edit", ensureLogin.ensureLoggedIn("/app"), (req, res, next) => {
  const { status } = req.body;
  Patients.updateOne({ bsn: req.params.id }, { $set: { status: status } })
    .then((data) => {
      res.render("app/lookup/app-edit-patient-completed", { id: req.params.id });
    })
    .catch((err) => next(err));
});

// ## LOGOUT PROCESS ##

// GET logout route
mobileAppRouter.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = mobileAppRouter;
