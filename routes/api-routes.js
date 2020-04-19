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

// Infection Status - Daily count of provided status
apiRoutes.get("/infections/overview/status/:statusInput/:startDate", (req, res, next) => {
  const state = req.params.statusInput;
  const relDate = req.params.startDate;

  // Match the status from the URL, the perform a gte match on the history.Date field (array)
  // resolve the history array, then group using the history.date, and sum the results based on the date
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

  // First unpack the history array, then do the match using a gte en the history.Date field
  // then group using the history.date and the history.state, and sum the results
  // Then reformat the group data using $project for the api results and sort it.
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
      let workingDate;
      let statusData = {};
      let results = {};
      data.forEach((arr) => {
        workingDate === arr.date
          ? Object.assign(statusData, { [arr.state]: arr.amount })
          : ((statusData = {}), (workingDate = arr.date));
        Object.assign(statusData, { [arr.state]: arr.amount });
        Object.assign(results, { [arr.date]: statusData });
      });
      res.json(results);
    }
  });
});

// Total count of Patients
apiRoutes.get("/infections/totals", (req, res, next) => {
  Patients.countDocuments().then((data) => {
    res.json({ totals: data });
  });
});


// Total count of Patients per date

apiRoutes.get("/infections/totals/:dateId", (req, res, next) => {
  const relDate = req.params.dateId;
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
        _id: null,
        amount: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        amount: 1,
      },
    },
  ]).then((data) => {
      let jsonData;
      if (!data[0]) {
        jsonData = 0;
      } else {
        jsonData = data[0].amount;
      }
      res.json({ "total": jsonData });
  });
});


// Fatality Percentage
apiRoutes.get("/infections/fatalities", (req, res, next) => {
  Patients.find({ status: { $exists: true } }, { _id: 0, status: 1 }).then((data) => {
    const total = Object.keys(data).length;
    const deceased = Object.values(data).filter((word) => word.status === "Deceased").length;
    const result = ((deceased / total) * 100).toFixed(2);
    res.json({ percentage: result });
  });
});

// Infection Status - Total per state
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

// Infection Status - Per state From Start Date to Now
apiRoutes.get("/infections/:state/:startDate", (req, res, next) => {
  const state = req.params.state;
  const relDate = req.params.startDate;
  console.log(req.params.state);
  console.log(req.params.startDate);
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




// GET route for list patients with pagination
apiRoutes.get('/patientlist-pagination',(req,res,next) => {
  var pageNo = parseInt(req.query.pageNo)
  var size = parseInt(req.query.size)
  var query = {}
  if(pageNo < 0 || pageNo === 0) {
        response = {"error" : true,"message" : "invalid page number, should start with 1"};
        return res.json(response)
  }
  query.skip = size * (pageNo - 1)
  query.limit = size
  // Find some documents
       Patients.count({},function(err,totalCount) {
         console.log(totalCount)
             if(err) {
               response = {"error" : true,"message" : "Error fetching data"}
             }
         Patients.find({},{},query).populate('bsn')
         .then(data => {                         
          const totalPages = Math.ceil(totalCount / size)
          response = {"error" : false,"message" : data,"pages":totalPages};
            res.json(response);
         })
         .catch(err => {
          response = {"error" : true,"message" : "Error fetching data"};
          res.json(response);
         })
         
       })
      


})




module.exports = apiRoutes;
