
// Users dummy data
const UsersList = [{
      ID: 1,
      username: 'friso',
      role: "HEALTHWORKER",    
      region: "GGD Amsterdam",
      timestamps: "2020/02/04"},
      {
        ID: 2,
        username: 'daniel',
        role: "ADMIN",    
        region: "GGD Amsterdam",
        timestamps: "2020/02/05"}
]
  
console.log(UsersList)
// Render user data in a table

const userListTable = document.getElementById('userlist')
UsersList.forEach((value,index) => {
let userRow = `<tr><td>${index+1}</td><td>${value.username}</td><td>${value.region}</td>
<td>${value.role}</td><td>${value.timestamps}</td><td><a href="#" id="pencil" style="float: right"><i class="fa fa-pencil-square-o" aria-hidden="true" id='${value.ID}'></i></a></td></tr>`
userListTable.insertAdjacentHTML('beforebegin',userRow );

})