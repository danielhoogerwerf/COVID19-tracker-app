// // Get geolocation of the patient and registrate it in the database

// import { compareSync } from "bcrypt";

// if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(showPosition);
// } else {
//     // Geolocation is not supported by this browser
// }

// function showPosition(position) {
//  axios({
//    method: "post",
//    url: "app/signup",
//    data: {
//      latitude: position.coords.latitude,
//      longitude: position.coords.longitude,
//    },
//  });
// }

// Modal for delete button userlist

const $userlist = document.getElementById('userlist')
const $deleteModal = document.getElementById('delete-modal')
const $deleteUser = document.getElementById('user')

if ($userlist){

$userlist.addEventListener('click', event => {
console.log(event.target.className)
if (event.target.className === 'fa fa-trash') {
console.log(event.target)
const dataDeleteID = event.target.parentElement.getAttribute('data-delete-id')
const dataDeleteUser = event.target.parentElement.getAttribute('data-username')
console.log(dataDeleteUser)
$deleteModal.href = dataDeleteID
$deleteUser.innerText = dataDeleteUser
}
}

)
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


if (mainNav && navBarToggle){

navBarToggle.addEventListener("click", function() {
  mainNav.classList.toggle("active");
});

}






// Infection chart for the dashboard
window.addEventListener("DOMContentLoaded", stackedChart());

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
