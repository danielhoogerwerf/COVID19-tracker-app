// Module declarations
const express = require("express");
const mobileAppRouter = express.Router();
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");
const moment = require("moment");

// checkRoles middleware
const checkRoles = require("../auth/checkRoles");

// Models declarations
const Users = require("../models/users");
const BSN = require("../models/bsn");
const Patients = require("../models/patients");

// ## LOGIN PROCESS ##

// GET route Login page app
mobileAppRouter.get("/login", (req, res, next) => {
  res.render("app/app-login", { message: req.flash("error") });
});

// POST route Login page app
mobileAppRouter.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/app/",
    failureRedirect: "/app/login",
    failureFlash: true,
  })
);

// ## HOME SCREEN ##

// GET route home page
mobileAppRouter.get("/", ensureLogin.ensureLoggedIn("/app/login"), (req, res, next) => {
  res.render("app/app-home");
});

// ## SIGN UP PROCESS ##

// INTERNAL USE -- GET route BSN SignUp
mobileAppRouter.get("/signup/bsn-internal", checkRoles("ADMIN"), (req, res, next) => {
  res.render("app/signup/app-signup-bsn-internal");
});

// INTERNAL USE -- POST route BSN SignUp
mobileAppRouter.post("/signup/bsn-internal", checkRoles("ADMIN"), (req, res, next) => {
  const { bsn, name, birthdate, age, gender } = req.body;
  BSN.create({
    bsnnumber: bsn,
    name: name,
    birthdate: birthdate,
    age: age,
    gender: gender,
  })
    .then(() => {
      res.send("Done");
    })
    .catch((err) => next(err));
});

// Step 1 - GET route Lookup person page
mobileAppRouter.get("/signup", ensureLogin.ensureLoggedIn("/app/login"), (req, res, next) => {
  res.render("app/signup/app-signup-lookup-person");
});

// POST route Lookup person page
mobileAppRouter.post("/signup/lookup", ensureLogin.ensureLoggedIn("/app/login"), (req, res, next) => {
  const { birthdate } = req.body;
  let { name } = req.body;
  if (name === "") {
    name = "NoNameEntered!";
  }

  BSN.find({ $or: [{ birthdate: birthdate }, { name: { $regex: ".*" + name, $options: "i" } }] }).then((data) => {
    res.render("app/signup/app-signup-lookup-person-result", { results: data });
  });
});

// Step 2 - GET route Lookup already patient
mobileAppRouter.get("/signup/lookup/:id", ensureLogin.ensureLoggedIn("/app/login"), (req, res, next) => {
  let patientIsRegistered;
  Patients.find({ bsn: req.params.id })
    .populate("bsn")
    .populate("healthcareworker")
    .then((patientsResults) => {
      if (patientsResults[0] !== undefined) {
        patientIsRegistered = patientsResults[0].status;
      }
    })
    .then(() => {
      BSN.findById(req.params.id)
        .then((bsnResults) => {
          if (patientIsRegistered) {
            res.render("app/signup/app-signup-lookup-person-result", { bsnResults, patientIsRegistered });
          } else {
            const momentDate = moment(bsnResults.birthdate).format("YYYY-MM-DD");
            res.render("app/signup/app-signup-patient", { bsnResults, formattedDate: momentDate });
          }
        })
        .catch((e) => next(e));
    })
    .catch((e) => next(e));
});

// Step 3 - GET route SignUp page
mobileAppRouter.get("/signup/patient", ensureLogin.ensureLoggedIn("/app/login"), (req, res, next) => {
  res.render("app/signup/app-signup-patient");
});

// POST route SignUp page
mobileAppRouter.post("/signup/patient", ensureLogin.ensureLoggedIn("/app/login"), (req, res, next) => {
  patient = JSON.parse(JSON.stringify(req.body));
  res.render("app/signup/app-signup-confirmation", { patient });
});

// Step 4 - POST route Confirmation page
mobileAppRouter.post("/signup/confirmation", ensureLogin.ensureLoggedIn("/app/login"), (req, res, next) => {
  const { name, birthdate, age, region, gender, bsnnumber, status } = req.body;
  BSN.create({
    bsnnumber: bsnnumber,
    name: name,
    birthdate: birthdate,
    age: age,
    gender: gender,
  })
    .then((bsn) => {
      Patients.create({
        bsn: bsn._id,
        healthcareworker: req.user.id,
        status: status,
        region: region,
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
mobileAppRouter.get("/lookup/patient", ensureLogin.ensureLoggedIn("/app/login"), (req, res, next) => {
  let userRegion = { region: req.user.region };
  console.log(userRegion);
  console.log(req.user.role);
  if (req.user.role === "ADMIN") {
    userRegion = {};
  }
  Patients.find(userRegion)
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
mobileAppRouter.post("/lookup/patient", ensureLogin.ensureLoggedIn("/app/login"), (req, res, next) => {
  const { birthdate } = req.body;
  let { name } = req.body;
  if (name === "") {
    name = "NoNameEntered!";
  }

  Patients.find({})
    .populate({
      path: "bsn",
      match: { $or: [{ birthdate: birthdate }, { name: { $regex: ".*" + name, $options: "i" } }] },
      select: "name birthdate age gender bsnnumber",
    })
    .then((data) => {
      res.render("app/lookup/app-lookup-results-patient", { results: data });
    })
    .catch((e) => next(e));
});

// GET route Lookup by ID
mobileAppRouter.get("/lookup/patient/:id", ensureLogin.ensureLoggedIn("/app/login"), (req, res, next) => {
  // Pay attention that the references defined in Patients model match the mongoose.model("") of BSN and User
  Patients.find({ bsn: req.params.id })
    .populate("bsn")
    .populate("healthcareworker")
    .then((data) => {
      res.render("app/lookup/app-selected-patient", { results: data });
    });
});

// GET route Edit Patient
mobileAppRouter.get("/lookup/patient/:id/edit", ensureLogin.ensureLoggedIn("/app/login"), (req, res, next) => {
  Patients.find({ bsn: req.params.id })
    .populate("bsn")
    .populate("healthcareworker")
    .then((data) => {
      res.render("app/lookup/app-edit-patient", { results: data });
    });
});

// POST route Edit Patient
mobileAppRouter.post("/lookup/patient/:id/edit", ensureLogin.ensureLoggedIn("/app/login"), (req, res, next) => {
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
