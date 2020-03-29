const express        = require("express");
const mobileAppRouter = express.Router();



mobileAppRouter.get('/', (req, res, next) => {
    res.render('mobile-app/index');
  });
  



module.exports = mobileAppRouter;