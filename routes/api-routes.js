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

apiRoutes.get("/dbdata/infections", (req, res, next) => {
    
    res.json(req.user)
})


module.exports = apiRoutes;