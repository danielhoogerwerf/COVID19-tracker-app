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

// Password strength


var strength = {
        0: "Worst ☹",
        1: "Bad ☹",
        2: "Weak ☹",
        3: "Good ☺",
        4: "Strong ☻"
}

const username = document.getElementById('username');
const passwordold = document.getElementById('passwordold');
const password1 = document.getElementById('passwordnew1');
const password2 = document.getElementById('passwordnew2');
const meter = document.getElementById('password-strength-meter');
const text = document.getElementById('password-strength-text');

if (password1) {
password1.addEventListener('input', function()
{
    var val = password1.value;
    var result = zxcvbn(val);
    
    // Update the password strength meter
    meter.value = result.score;
   
    // Update the text indicator
    if(val !== "") {
        text.innerHTML = "Strength: " + "<strong>" + strength[result.score] + "</strong>" + "<span class='feedback'>" + result.feedback.warning + " " + result.feedback.suggestions + "</span"; 
    }
    else {
        text.innerHTML = "";
    }
});
}
// Compare the new passwords
const submitNewPassword = document.getElementById('submitNewPassword')
if (submitNewPassword) {
submitNewPassword.addEventListener('click', event => {
  event.preventDefault();
if (password1.value !== password2.value){
console.log('passwords are not the same')
}
else {
  console.log('passwords are matching')
  axios({
    method: 'post',
    url: "/app/newpassword",
    data: {
      username: username.value,
      oldpassword: passwordold.value,
      passnew1: password1.value,
      passnew2: password2.value
    }
  });
}
  })
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
