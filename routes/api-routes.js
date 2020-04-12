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
  Patients.find({ status: { $exists: true } }, { _id: 0, status: 1 }).then((data) => {
    const total = Object.keys(data).length;
    const deceased = Object.values(data).filter((word) => word.status === "Deceased").length;
    res.json({ "Percentage of deceased": (deceased / total) * 100 });
  });
});

// Infection Status - Daily count of all statuses
apiRoutes.get("/infections/overview/:startDate", (req, res, next) => {
  const relDate = req.params.startDate;
  // const currentDate = moment().format("YYYY-MM-DD");

  // Match status
  Patients.aggregate([
    {
      $match: {
        "history.Date": {
          $gte: new Date(relDate),
        },
      },
    },
    {
      $unwind: {
        path: "$history",
      },
    },
    {
      $group: {
        _id: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$history.Date",
            },
          },
          state: "$history.Status",
        },
        sum: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        "_id.date": 1,
      },
    },
  ]).then((data) => {
    res.json(data);

    // let jsonData;
    // if (data[0] === undefined) {
    //   jsonData = 0;
    // } else {
    //   jsonData = data[0].status;
    // }
    //res.json({ state: state, amount: jsonData });
  });
});


// Infection Status - General
apiRoutes.get("/infections/:state", (req, res, next) => {
  const state = req.params.state;
  const relDate = Patients.aggregate([
    { $match: { status: state } },
    { $project: { _id: 0, status: 1 } },
    { $count: "status" },
  ]).then((data) => {
    let jsonData;
    if (data[0] === undefined) {
      jsonData = 0;
    } else {
      jsonData = data[0].status;
    }
    res.json({ state: state, amount: jsonData });
  });
});

// Infection Status - From Start Date to Now
apiRoutes.get("/infections/:state/:startDate", (req, res, next) => {
  const state = req.params.state;
  const relDate = req.params.startDate;
  // const currentDate = moment().format("YYYY-MM-DD");
  Patients.aggregate([
    { $match: { $and: [{ status: "IC" }, { "history.Date": { $gte: relDate } }] } },
    { $project: { _id: 0, status: 1 } },
    { $count: "status" },
  ]).then((data) => {
    let jsonData;
    if (data[0] === undefined) {
      jsonData = 0;
    } else {
      jsonData = data[0].status;
    }
    res.json({ state: state, amount: jsonData });
  });
});

// // Infection Status - Daily count of defined status
// apiRoutes.get("/infections/overview/:status/:startDate", (req, res, next) => {
//   const state = req.params.status
//   const relDate = req.params.startDate;
//   // const currentDate = moment().format("YYYY-MM-DD");

//   // Match status
//   Patients.aggregate([
//     {
//       $match: {
//         $and: [
//           { status: "IC" },
//           {
//             "history.Date": {
//               $gte: new Date(relDate),
//             },
//           },
//         ],
//       },
//     },
//     {
//       $unwind: {
//         path: "$history",
//       },
//     },
//     {
//       $group: {
//         _id: {
//           $dateToString: {
//             format: "%Y-%m-%d",
//             date: "$history.Date",
//           },
//         },
//         sum: {
//           $sum: 1,
//         },
//       },
//     },
//     {
//       $sort: {
//         _id: 1,
//       },
//     },
//   ]).then((data) => {
//     console.log(data);
//     let jsonData;
//     if (data[0] === undefined) {
//       jsonData = 0;
//     } else {
//       jsonData = data[0].status;
//     }
//     res.json({ state: state, amount: jsonData });
//   });
// });


module.exports = apiRoutes;
