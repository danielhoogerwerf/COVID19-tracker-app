const Users = require("../models/users");
const bcrypt = require("bcrypt");

function checkPassword() {
  return function (req, res, next) {
    console.log(req.body.password);
    Users.find({ username: req.body.username })
      .then((user) => {
        bcrypt.compare(req.body.password, user[0].password, (err, same) => {
          if (!same) {
            console.log("password not correct");
            const message = "Incorrect password";
            res.render("app/app-login", { message, user: user[0].username });
            return;
          } else {
            if (user[0].passwordflag) {
              console.log("Password is new");
              res.render("app/app-login-change-password", { user: user[0].username });
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
