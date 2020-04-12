

// // Get geolocation of the patient and registrate it in the database

// if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(showPosition);
// } else {
//     // Geolocation is not supported by this browser
// }

function showPosition(position) {
       axios({
        method: 'post',
        url: 'app/signup',
        data: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
      });
}

// NAV BAR TOGGLE MENU
let mainNav = document.getElementById("js-menu");
let navBarToggle = document.getElementById("js-navbar-toggle");

navBarToggle.addEventListener("click", function() {
  mainNav.classList.toggle("active");
});
