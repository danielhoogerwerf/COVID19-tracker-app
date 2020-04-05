require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Models
const Users = require("../models/users");
const BSN = require("../models/bsn");
const Patients = require("../models/patients");

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((x) => console.log(`Connected to Database: "${x.connections[0].name}" for seeding data...`))
  .then(() => {
    bcrypt.hash(process.env.ADMIN_PASSWORD, 10).then((hash) => {
      Users.create({
        username: "admin",
        password: hash,
        role: "ADMIN",
        region: "GGD Amsterdam",
      }).then((usr) => {
        BSN.create({
          bsnnumber: 112233445,
          name: "Nica Cat",
          birthdate: "1981-01-11",
          age: 5,
          gender: "Other",
        }).then((bsn) => {
          Patients.create({
            bsn: bsn._id,
            healthcareworker: usr._id,
            status: "IC",
            region: "GGD Amsterdam",
          });
        });
      });
    });
  })
  .then(() => {
    bcrypt.hash(process.env.DANIEL_PASSWORD, 10).then((hash) => {
      Users.create({
        username: "daniel",
        password: hash,
        role: "HEALTHWORKER",
        region: "GGD Amsterdam",
      }).then((usr) => {
        BSN.create({
          bsnnumber: 987654321,
          name: "Daniel Hoogerwerf",
          birthdate: "1982-11-12",
          age: 37,
          gender: "Female",
        }).then((bsn) => {
          Patients.create({
            bsn: bsn._id,
            healthcareworker: usr._id,
            status: "Hospitalized",
            region: "GGD Amsterdam",
          });
        });
      });
    });
  })
  .then(() => {
    bcrypt.hash(process.env.FRISO_PASSWORD, 10).then((hash) => {
      Users.create({
        username: "friso",
        password: hash,
        role: "HEALTHWORKER",
        region: "GGD regio Utrecht",
      }).then((usr) => {
        BSN.create({
          bsnnumber: 123456789,
          name: "Friso Homan",
          birthdate: "1982-11-11",
          age: 32,
          gender: "Male",
        }).then((bsn) => {
          Patients.create({
            bsn: bsn._id,
            healthcareworker: usr._id,
            status: "Recovered",
            region: "GGD regio Utrecht",
          });
        });
      });
    });
  })
  .then(() => {
    console.log("All finished succesfully.");
  })
  .catch((err) => console.log(`Error connecting to the MongoDB: ${err}`));
