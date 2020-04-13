

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

// Moment date declarations
const pastMonth = moment().subtract(1, "months").format('YYYY-MM-DD');
const currentDate = moment().format('YYYY-MM-DD');

// Stacked bar chart Infections
const stackedChart = () => {
   axios
     .get(`/api/infections/overview/totals/${pastMonth}`)
     .then((response) => {
       outbreakChart(response.data);
     })
     .catch((err) => console.log("Error while getting the data: ", err));
}

// NAV BAR TOGGLE MENU
let mainNav = document.getElementById("js-menu");
let navBarToggle = document.getElementById("js-navbar-toggle");

navBarToggle.addEventListener("click", function() {
  mainNav.classList.toggle("active");
});


//Generic delete function
function deleteConfirm(entity, successCallback){

  var modal = $('#genericDeleteModal');
  modal.find('.modal-body .entityType').html(entity);
  modal.modal('show')
  $('#confirmDeleteButton').bind('click', function() 
  {
    var deleteTextInput = modal.find('#deleteConfirmText');
    if(deleteTextInput.val() === 'Delete')
    {
      modal.modal('hide');
      successCallback();
    }
  })
};
$('#genericDeleteModal').on('hide.bs.modal',function(){
   var modal = $(this);
   var deleteTextInput = modal.find('#deleteConfirmText');
   deleteTextInput.val('');
});

//Local delete button callback
$('#userDeleteButton').on('click',function(){
  var entity = $('#SelectedUser').val();
  deleteConfirm(entity,myRandomSuccessCallBackFunction)
});
//local success callback
function myRandomSuccessCallBackFunction()
{
  alert('user deleted');
}

// Infection chart for the dashboard
window.addEventListener("DOMContentLoaded", stackedChart());

