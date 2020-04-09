// Module declarations
const express = require("express");
const apiRoutes = express.Router();
const ensureLogin = require("connect-ensure-login");

// Models declarations
const Users = require("../models/users");
const BSN = require("../models/bsn");
const Patients = require("../models/patients");

// ## Home route ##
apiRoutes.get("/", (req, res, next) => {
  res.redirect("/");
});

// ## Dashboard data API ##

// Fatality Rate
apiRoutes.get("/infections/fatality", (req, res, next) => {
  Patients.find({ status: { $exists: true } },  { _id: 0, status: 1 } ).then(
    (data) => {
      const total = Object.keys(data).length
      const deceased = Object.values(data).filter(word => word.status === "Deceased").length;
      res.json({ "Percentage of deceased": (deceased/total)*100 });
    }
  );
});

// Infection Status
apiRoutes.get("/infections/:state", (req, res, next) => {
  const state = req.params.state;
  Patients.aggregate([{ $match: { status: state } }, { $project: { _id: 0, status: 1 } }, { $count: "status" }]).then(
    (data) => {
      let jsonData;
      if (data[0] === undefined) {
        jsonData = 0;
      } else {
        jsonData = data[0].status;
      }
      res.json({ "Amount of Infections": jsonData });
    }
  );
});

module.exports = apiRoutes;
