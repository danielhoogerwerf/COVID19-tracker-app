
// Confirmed Infections Data
const apiTotalPatients = () => {
  axios
    .get(`/api/patientlist-pagination`)
    .then((response) => {
     response
const patients = response.data.message
patients.forEach(element => {
    console.log(element)    
});
    })
    .catch((err) => {
      console.log("Error while getting the data: ", err);    
    });
};

window.addEventListener("DOMContentLoaded", () => {
apiTotalPatients()

});