// // Get geolocation of the patient and registrate it in the database

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

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 6,
    center: {lat: 52.092876, lng: 5.104480},
    zoomControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
  });

 
map.data.setStyle({
  fillColor: 'green',
  strokeWeight: 1
});
  map.data.loadGeoJson("https://cartomap.github.io/nl/wgs84/ggdregio_2019.geojson")
                
}