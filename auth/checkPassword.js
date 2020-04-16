const Users = require("../models/users");

function checkPassword() {
    return function(req, res, next) {
      Users.find({username: req.body.username})
      .then(user => {       
      if (user[0].passwordflag) {
         console.log('Password is new')    
         res.render("app/app-login-change-password",{user:user[0].username}); 
        return
      }
      else {
        console.log('Password is old')
      next()
      }
    })
  .catch(err => console.log(err))
    }
  }


  module.exports = checkPassword;