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
    useCreateIndex: true
  })
  .then(x => console.log(`Connected to Database: "${x.connections[0].name}" for seeding data...`))
  .then(() => {
    bcrypt.hash(process.env.ADMIN_PASSWORD, 10).then(hash => {
      Users.create({
        username: "admin",
        password: hash,
        role: "ADMIN",
        region: "GGD Amsterdam"
      })
        .then(usr => {
          BSN.create({
            bsnnumber: 123456789,
            name: "Daniel Hoogerwerf",
            birthdate: "1982-11-15",
            age: 37,
            gender: "Male"
          }).then(bsn => {
            Patients.create({
              bsn: bsn._id,
              name: "Daniel Hoogerwerf",
              birthdate: "1982-11-15",
              healthcareworker: usr._id,
              status: "Hospitalized",
              region: "GGD Amsterdam"
            });
          });
        })
        .then(() => {
          console.log("All finished succesfully.");
        });
    });
  })
  .catch(err => console.log(`Error connecting to the MongoDB: ${err}`));
