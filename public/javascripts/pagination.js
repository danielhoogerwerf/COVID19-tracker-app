

const $paginationBox = document.getElementById('pagination-box')
const $previous = document.getElementById('previous')
const $next = document.getElementById('next')
const $sizeUsers = document.getElementById('size-users')
const $patientList = document.getElementById('patient-list')

class Paginate {
    constructor () {
    this.currentPage = 1;   
    this.currentSize = 10;    
    this.currentTotal;
    //this.totalPages = Math.floor(this.currentTotal/this.currentSize)
    this.totalPages;
    this.pageNrColor = ''
    }
    initialize(){
    this.getQueryData(this.currentPage,this.currentSize)    
    // this.renderPaginationList()
    }    

    next () {
    this.currentPage++
    $previous.classList.remove("disabled");
    this.getQueryData(this.currentPage,this.currentSize)
    if (this.currentPage >= this.totalPages) {
    $next.classList.add("disabled");
       } 
    }   

    previous(){
    this.currentPage--
    $next.classList.remove("disabled");
    this.getQueryData(this.currentPage,this.currentSize)
       if (this.currentPage < 2) {
    $previous.classList.add("disabled");
       } 
    }
    getPagenumber(pageNumber){
    this.currentPage = pageNumber   
    this.getQueryData(this.currentPage,this.currentSize)
    $previous.classList.remove("disabled");
    $next.classList.remove("disabled");
        if (this.currentPage < 2) {
    $previous.classList.add("disabled");
       } 
         if (this.currentPage >= this.totalPages) {
    $next.classList.add("disabled");
       } 
    console.log(this.currentPage)
    }
    changeSizeInput(size){  
    this.currentSize = size;
    console.log(this.currentSize)
    this.getQueryData(this.currentPage,this.currentSize)
    }  
    renderPatientList(patients) {
    
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
    renderPaginationList(){
    
     this.pageNrColor = ''
     
     let paOne = `<li class="page-item "><a class="page-link" id='${this.currentPage-1}' href="#">${this.currentPage -1}</a></li>`
     let paBegin = `<li class="page-item disabled"><a class="page-link" id='${this.currentPage}' href="#">${this.currentPage}</a></li>
     <li class="page-item "><a class="page-link" id='${this.currentPage+1}' href="#">${this.currentPage+1}</a></li>
     <li class="page-item "><a class="page-link" id='${this.currentPage+2}' href="#">${this.currentPage+2}</a></li>`

    if (this.currentPage >= this.totalPages) {this.pageNrColor="disabled"}
  const paTwo =`<li class="page-item "><a class="page-link" id='${this.currentPage}' href="#">${this.currentPage}</a></li>`
    let paThree = `<li class="page-item ${this.pageNrColor}"><a class="page-link" id='${this.currentPage +1}' href="#">${this.currentPage +1}</a></li>`

    if (this.currentPage <= 1) {
        document.getElementById("paginationPageView").innerHTML=`<ul class="pagination">${paBegin}</ul>`;
      } else {
      document.getElementById("paginationPageView").innerHTML=`<ul class="pagination">${paOne}${paTwo}${paThree}</ul>`
      }
    

  
     
  
     
      
    //const row = `<li class="page-item"><a class="page-link" id='${this.currentPage+1}' href="#">test${value}</a></li>`

    ;
    //document.getElementById("paginationPageView").innerHTML=` <ul class="pagination"><li class="page-item ${this.pageNrColor}"><a class="page-link" id='${this.currentPage}' href="#">${this.currentPage}</a></li>
    //<li class="page-item"><a class="page-link " id='${this.currentPage +1}' href="#">${this.currentPage +1 }</a></li>
    //<li class="page-item${this.pageNrColor}"><a class="page-link " id='${this.currentPage+2}' href="#">${this.currentPage +2}</a></li></ul>`;
    
    }

    getQueryData(pageNr, size){
    axios.get(`/api/patientlist?pageNo=${pageNr}&size=${size}`)
    .then(response => {   
     this.renderPatientList(response.data.message);
     this.totalPages = response.data.pages;     
     this.renderPaginationList();
     console.log(response.data.pages)
     })
     .catch(err => console.log(err))
    }
}


window.addEventListener("DOMContentLoaded", () => {

const paginate = new Paginate();
paginate.initialize();


$paginationBox.addEventListener('click', event => {        
     
if (event.target.parentElement.id === 'next') {
paginate.next();
                
}
else if (event.target.parentElement.id === 'previous') {
paginate.previous();
            
}
else if (event.target.classList[0] === 'page-link') {
//    console.log(event.target.id)
paginate.getPagenumber(parseInt(event.target.id))

}
})


$sizeUsers.addEventListener('change', (event) => {
    console.log(event.target.value);
   paginate.changeSizeInput(event.target.value);
  
  });


})

