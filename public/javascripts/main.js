// // Get geolocation of the patient and registrate it in the database

// if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(showPosition);
// } else {
//     // Geolocation is not supported by this browser
// }

function showPosition(position) {
  axios({
    method: "post",
    url: "app/signup",
    data: {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    },
  });
}

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

// NAV BAR TOGGLE MENU
let mainNav = document.getElementById("js-menu");
let navBarToggle = document.getElementById("js-navbar-toggle");

if (navBarToggle && mainNav) {
  navBarToggle.addEventListener("click", function () {
    mainNav.classList.toggle("active");
  });
}

// When content is loaded, fill the dashboard with real data from the local API
// Functions are defined in apidata.js

window.addEventListener("DOMContentLoaded", () => {
  // Create the infection chart
  stackedChart();

  // Update Fatalities Widget
  apiFatalitiesData();

  // Update Totals Widget
  apiTotalData();

  // Update Hospitalized Widget
  apiHospitalizedData();

  // Update Intensive Care Widget
  apiICData();

  // Update Deceased Widget
  apiDeceasedData();  

  // Update Recovered Widget
  apiRecoveredData();

  // Update Last Updates time
  document.getElementById("totals-last-update").innerHTML = currentDate;
});
