function checkRoles(role) {
  return function (req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      next();
    } else {
      req.flash("error", "Access Denied!");
      res.redirect("/admin/acces-denied");
    }
  };
}

module.exports = checkRoles;
