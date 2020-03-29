const express        = require("express");
const Router         = express.Router();

Router.get('/', (req, res, next) => {
    res.render('index');
  });

Router.post('/',(req,res,next) => {
console.log(req.body.username)

// Placeholder code. Authentication will follow later
  if (req.body.username === 'Friso') {

  res.render('admin-dashboard/index')

  }

  else {

  res.render('app/index')

  }

});
  
module.exports = Router;