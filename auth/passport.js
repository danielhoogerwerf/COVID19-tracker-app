// Module declarations
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// Model declaration
const User = require("../models/users");

// Passport
passport.serializeUser((user, callback) => {
  callback(null, user._id);
});

passport.deserializeUser((id, callback) => {
  User.findById(id)
    .then(user => {
      callback(null, user);
    })
    .catch(error => {
      callback(error);
    });
});

passport.use(
  new LocalStrategy((username, password, next) => {
    User.findOne({ username }).then(user => {
      if (!user) {
        return next(null, false, { message: "Incorrect Username" });
      }
      console.log(password);
      bcrypt.compare(password, user.password, (err, same) => {
        if (!same) {
          next(null, false, { message: "Password incorrect" });
        } else {
          console.log("bla");
          next(null, user);
        }
      });
    });
  })
);

module.exports = passport;
