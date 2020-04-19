
function renderPatientList(patients) {
    const $patientList = document.getElementById('patient-list')
    $patientList.innerHTML = '';
   
        
patients.forEach(element => {
    element.bsn[0].birthdate = moment().format("DD MMM YYYY");   
    element.createdAt = moment().format("DD MMM YYYY, HH:mm:ss");
    let row = `<tr><td>${element.bsn[0].bsnnumber}</td>
    <td>${element.bsn[0].name}</td><td>${element.bsn[0].gender}</td>
    <td>${element.bsn[0].birthdate}</td><td>${element.status}</td>
    <td>${element.region}</td><td>${element.createdAt}</td></tr>`
            $patientList.insertAdjacentHTML('afterbegin', row);
    
        })
    }




// Confirmed Infections Data
const apiTotalPatients = (pageNr, size) => {
    axios.get(`/api/patientlist?pageNo=${pageNr}&size=${size}`)
    .then(response =>  {
        console.log(response)
        renderPatientList(response.data.message);
    })
    .catch(err => console.log(err))
};

window.addEventListener("DOMContentLoaded", () => {
    let currentPage = 1;
    let numberPatientsPage = 10   
    const $previous = document.getElementById('previous')
    const $next = document.getElementById('next')
    
    // Generate default patient list
apiTotalPatients(currentPage, numberPatientsPage)

// Event listener for pagination event
const $paginationBox = document.getElementById('pagination-box')
$paginationBox.addEventListener('click', event => {
    if (event.target.parentElement.id === 'next') {
        currentPage++
        apiTotalPatients(currentPage,numberPatientsPage)
        $previous.classList.remove("disabled");
            
    } else if (event.target.parentElement.id === 'previous') {
        currentPage--
        apiTotalPatients(currentPage,numberPatientsPage)
        if (currentPage === 1) {        
        $previous.classList.add("disabled");
        }
        }
    })
})