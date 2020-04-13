// Module declarations
const express = require("express");
const apiRoutes = express.Router();
const ensureLogin = require("connect-ensure-login");

// Models declarations
const Patients = require("../models/patients");

// ## Home route ##
apiRoutes.get("/", (req, res, next) => {
  res.redirect("/");
});

// ## Dashboard data API ##

// Infection Status - Daily count of defined status
apiRoutes.get("/infections/overview/status/:statusInput/:startDate", (req, res, next) => {
  const state = req.params.statusInput;
  const relDate = req.params.startDate;

  // Match status
  Patients.aggregate([
    {
      $match: {
        $and: [
          { status: state },
          {
            "history.Date": {
              $gte: new Date(relDate),
            },
          },
        ],
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
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$history.Date",
          },
        },
        sum: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        amount: "$sum",
      },
    },
    {
      $sort: {
        date: 1,
      },
    },
  ]).then((data) => {
    if (!data[0]) {
      res.json({ error: "No data available for chosen period." });
    } else {
      res.json(data);
    }
  });
});

// Infection Status - Daily count of all statuses
apiRoutes.get("/infections/overview/totals/:startDate", (req, res, next) => {
  const relDate = req.params.startDate;
  Patients.aggregate([
      {
        $unwind: {
          path: "$history",
        },
      },
      {
        $match: {
          "history.Date": {
            $gte: new Date(relDate),
          },
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
        $project: {
          _id: 0,
          date: "$_id.date",
          state: "$_id.state",
          amount: "$sum",
        },
      },
      {
        $sort: {
          date: 1,
          state: 1,
        },
      },
  ]).then((data) => {
    if (!data[0]) {
      res.json({ error: "No data available for chosen period." });
    } else {
      let workingDate
      let statusData = {};
      let results = {};
      data.forEach((arr) => {
        workingDate === arr.date ? (Object.assign(statusData, { [arr.state]: arr.amount })) : (statusData = {}, workingDate = arr.date);
        Object.assign(statusData, { [arr.state]: arr.amount });
        Object.assign(results, { [arr.date]: statusData });
        
      });
      res.json(results);
    }
  });
});

// Fatality Rate
apiRoutes.get("/infections/fatalities", (req, res, next) => {
  Patients.find({ status: { $exists: true } }, { _id: 0, status: 1 }).then((data) => {
    const total = Object.keys(data).length;
    const deceased = Object.values(data).filter((word) => word.status === "Deceased").length;
    res.json({ "Percentage of deceased": (deceased / total) * 100 });
  });
});

// Infection Status - General
apiRoutes.get("/infections/:state", (req, res, next) => {
  const state = req.params.state;
  Patients.aggregate([{ $match: { status: state } }, { $project: { _id: 0, status: 1 } }, { $count: "status" }]).then(
    (data) => {
      let jsonData;
      if (!data[0]) {
        jsonData = 0;
      } else {
        jsonData = data[0].status;
      }
      res.json({ state: state, amount: jsonData });
    }
  );
});

// Infection Status - From Start Date to Now
apiRoutes.get("/infections/:state/:startDate", (req, res, next) => {
  const state = req.params.state;
  const relDate = req.params.startDate;
  Patients.aggregate([
    { $match: { $and: [{ status: state }, { "history.Date": { $gte: new Date(relDate) } }] } },
    { $project: { _id: 0, status: 1 } },
    { $count: "status" },
  ]).then((data) => {
    let jsonData;
    if (!data[0]) {
      jsonData = 0;
    } else {
      jsonData = data[0].status;
    }
    res.json({ state: state, amount: jsonData });
  });
});

module.exports = apiRoutes;
