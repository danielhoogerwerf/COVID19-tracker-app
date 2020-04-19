// ## Axios local API Calls for the Admin Dashboard ##

// Fatalities Data
const apiFatalitiesData = () => {
  axios
    .get(`/api/infections/fatalities`)
    .then((response) => {
      document.getElementById("dashboard-data-fatalities").innerHTML = response.data.percentage + "%";
    })
    .catch((err) => {
      console.log("Error while getting the data: ", err);
      document.getElementById("dashboard-data-fatalities").innerHTML = "ERROR";
    });
};





// Confirmed Infections Data
const apiTotalData = () => {
  axios
    .get(`/api/infections/totals`)
    .then((response) => {
      document.getElementById("dashboard-data-total").innerHTML = response.data.totals;
    })
    .catch((err) => {
      console.log("Error while getting the data: ", err);
      document.getElementById("dashboard-data-total").innerHTML = "ERROR";
    });
};

// Confirmed Infections Data Today
const apiTotalDataToday = () => {

  const currentDate = moment().format("YYYY MM DD");
  
  axios
    .get(`/api/infections/totals/${currentDate}`)
    .then((response) => {
      console.log(response.data.total)
      document.getElementById("dashboard-data-total-today").innerHTML = response.data.total;
    })
    .catch((err) => {
      console.log("Error while getting the data: ", err);
      document.getElementById("dashboard-data-total").innerHTML = "ERROR";
    });
};






// Hospitalized Data
const apiHospitalizedData = () => {
  axios
    .get(`/api/infections/Hospitalized/`)
    .then((response) => {
      document.getElementById("dashboard-data-hospitalized").innerHTML = response.data.amount;
    })
    .catch((err) => {
      console.log("Error while getting the data: ", err);
      document.getElementById("dashboard-data-hospitalized").innerHTML = "ERROR";
    });
};

// Hospitalized Data daily
const apiHospitalizedDataToday = () => {

  const currentDate = moment().format("YYYY MM DD");
  
  axios
    .get(`/api/infections/Hospitalized/${currentDate}`)
    .then((response) => {
      document.getElementById("dashboard-data-hospitalized-today").innerHTML = response.data.amount;
    })
    .catch((err) => {
      console.log("Error while getting the data: ", err);
      document.getElementById("dashboard-data-hospitalized").innerHTML = "ERROR";
    });
};





// Intensive Care Data
const apiICData = () => {
  axios
    .get(`/api/infections/IC/`)
    .then((response) => {
      document.getElementById("dashboard-data-ic").innerHTML = response.data.amount;
    })
    .catch((err) => {
      console.log("Error while getting the data: ", err);
      document.getElementById("dashboard-data-ic").innerHTML = "ERROR";
    });
};


// IC Data daily
const apiICDataToday = () => {

  const currentDate = moment().format("YYYY MM DD");
  
  axios
    .get(`/api/infections/IC/${currentDate}`)
    .then((response) => {
      document.getElementById("dashboard-data-ic-today").innerHTML = response.data.amount;
    })
    .catch((err) => {
      console.log("Error while getting the data: ", err);
      document.getElementById("dashboard-data-ic").innerHTML = "ERROR";
    });
};



// Deceased Data
const apiDeceasedData = () => {
  axios
    .get(`/api/infections/Deceased/`)
    .then((response) => {
      document.getElementById("dashboard-data-deceased").innerHTML = response.data.amount;
    })
    .catch((err) => {
      console.log("Error while getting the data: ", err);
      document.getElementById("dashboard-data-deceased").innerHTML = "ERROR";
    });
};


// Deceased Data daily
const apiDeceasedDataToday = () => {

  const currentDate = moment().format("YYYY MM DD");
  
  axios
    .get(`/api/infections/Deceased/${currentDate}`)
    .then((response) => {
      document.getElementById("dashboard-data-deceased-today").innerHTML = response.data.amount;
    })
    .catch((err) => {
      console.log("Error while getting the data: ", err);
      document.getElementById("dashboard-data-deceased").innerHTML = "ERROR";
    });
};




// Recovered Data
const apiRecoveredData = () => {
  axios
    .get(`/api/infections/Recovered/`)
    .then((response) => {
      document.getElementById("dashboard-data-recovered").innerHTML = response.data.amount;
    })
    .catch((err) => {
      console.log("Error while getting the data: ", err);
      document.getElementById("dashboard-data-recovered").innerHTML = "ERROR";
    });
};

// Recovered Data daily
const apiRecoveredDataToday = () => {

  const currentDate = moment().format("YYYY MM DD");
  
  axios
    .get(`/api/infections/Recovered/${currentDate}`)
    .then((response) => {
      document.getElementById("dashboard-data-recovered-today").innerHTML = response.data.amount;
    })
    .catch((err) => {
      console.log("Error while getting the data: ", err);
      document.getElementById("dashboard-data-recovered").innerHTML = "ERROR";
    });
};


// ## Stacked bar chart Infections ##

// Moment date declarations
const pastMonth = moment().subtract(15, "days").format("YYYY-MM-DD");
const currentDate = moment().format("DD MMM YYYY, HH:mm:ss");

const stackedChart = () => {
  axios
    .get(`/api/infections/overview/totals/${pastMonth}`)
    .then((response) => {
      outbreakChart(response.data);
    })
    .catch((err) => console.log("Error while getting the data: ", err));
};


// When content is loaded, fill the dashboard with real data from the local API
// Functions are defined in apidata.js

window.addEventListener("DOMContentLoaded", () => {
  // Create the infection chart
  stackedChart();

  // Update Fatalities Widget
  apiFatalitiesData();

    // Update Totals Widget
  apiTotalData();

  apiTotalDataToday();
  // Update Hospitalized Widget
  apiHospitalizedData();

  apiHospitalizedDataToday();

  // Update Intensive Care Widget
  apiICData();

  apiICDataToday();

  // Update Deceased Widget
  apiDeceasedData();

  apiDeceasedDataToday();

  // Update Recovered Widget
  apiRecoveredData();

  apiRecoveredDataToday();

  // Update Last Updates time
  document.getElementById("totals-last-update").innerHTML = currentDate;
});
