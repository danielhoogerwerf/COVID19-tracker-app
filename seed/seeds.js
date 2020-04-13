require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const moment = require("moment")

// Models
const Users = require("../models/users");
const BSN = require("../models/bsn");
const Patients = require("../models/patients");

// Fake input data
const fakeData = require("./fakeData");

const fakeStatus = ["Home", "Hospitalized", "IC", "Deceased", "Recovered"];
const fakeRegion = [
  "Dienst Gezondheid & Jeugd Zuid-Holland Zuid",
  "GGD Amsterdam",
  "GGD Brabant-Zuidoost",
  "GGD Drenthe",
  "GGD Fryslan",
  "GGD Gelderland-Zuid",
  "GGD Gooi en Vechtstreek",
  "GGD Groningen",
  "GGD Haaglanden",
  "GGD Hart voor Brabant",
  "GGD Hollands-Midden",
  "GGD Hollands-Noorden",
  "GGD IJsselland",
  "GGD Kennemerland",
  "GGD Limburg-Noord",
  "GGD Noord- en Oost-Gelderland",
  "GGD regio Utrecht",
  "GGD Rotterdam-Rijnmond",
  "GGD Twente",
  "GGD West-Brabant",
  "GGD Zaanstreek-Waterland",
  "GGD Zeeland",
  "GGD Zuid-Limburg",
  "Veiligheids- en Gezondheidsregio Gelderland-Midden",
];

const fakeUsers = [
  "5e8f8113fed31047cc529c4c",
  "5e8f8147fed31047cc529c4f",
  "5e9048c98043314978203782",
  "5e904fc8c41e322798f697eb",
];

const randomNumber = () => Math.floor(Math.random() * 25);
const fakeDate = () => moment().subtract(randomNumber(), "days").utc().format();

mongoose
  .connect(process.env.MONGODB_URL, {
    //.connect("mongodb://localhost/covid19-tracker-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((x) => console.log(`Connected to Database: "${x.connections[0].name}" for seeding data...`))
  .then(() => {
    bcrypt
      .hash(process.env.ADMIN_PASSWORD, 10)
      .then((hash) => {
        Users.create({
          username: "admin",
          password: hash,
          role: "ADMIN",
          region: "GGD Amsterdam",
        }).then((usr) => {
          fakeData.forEach((element) => {
            BSN.create({
              bsnnumber: element.bsnnumber,
              name: element.name,
              birthdate: element.birthdate,
              age: element.age,
              gender: element.gender,
            }).then((bsn) => {
              const registerStatus = fakeStatus[Math.floor(Math.random() * fakeStatus.length)];
              Patients.create({
                bsn: bsn._id,
                history: { Status: registerStatus, Date: new Date(fakeDate()) },
                healthcareworker: fakeUsers[Math.floor(Math.random() * fakeUsers.length)],
                status: registerStatus,
                region: fakeRegion[Math.floor(Math.random() * fakeRegion.length)],
              }).then(() => {
                console.log("All finished succesfully.");
              });
            });
          });
        });
      })
      .catch((err) => console.log(`Error connecting to the MongoDB: ${err}`));
  });
