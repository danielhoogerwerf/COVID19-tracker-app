const express        = require("express");
const mobileAppRouter = express.Router();


// GET route Homepage app
mobileAppRouter.get('/', (req, res, next) => {
    res.render('mobile-app/index');
  });
  
// GET route SignUp page
mobileAppRouter.get('/signup', (req, res, next) => {

    res.render('mobile-app/signup');
  });
  


module.exports = mobileAppRouter;