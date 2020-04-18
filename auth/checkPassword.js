const Users = require("../models/users");
const bcrypt = require("bcrypt");

function checkPassword() {
  return function (req, res, next) {
    console.log(req.body.password);
    console.log(req.body.username)
    Users.find({ username: req.body.username })
      .then((user) => {
        let usr
        let pwd
        if (!user[0]) {pwd = user.password; usr = user.username} else {pwd = user[0].password; usr = user[0].username}
        bcrypt.compare(req.body.password, pwd, (err, same) => {
          if (!same) {
            console.log("password not correct");
            const message = "Incorrect password";
            res.render("app/app-login", { message, user: usr });
            return;
          } else {
            if (user[0].passwordflag || user.passwordflag) {
              console.log("Password is new");
              res.render("app/app-login-change-password", { user: usr});
              return;
            } else {
              console.log("Password is old");
              next();
            }
          }
        });
      })
      .catch((err) => console.log(err));
  };
}

module.exports = checkPassword;
