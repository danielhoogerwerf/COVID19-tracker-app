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

