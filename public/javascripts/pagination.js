
console.log('Patients')
// Confirmed Infections Data
const apiTotalPatients = () => {
  axios
    .get(`/admin/patients-pagination`)
    .then((response) => {
      console.log(response)
    })
    .catch((err) => {
      console.log("Error while getting the data: ", err);
    
    });
};


apiTotalPatients()