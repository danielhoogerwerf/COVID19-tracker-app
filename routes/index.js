const express        = require("express");
const Router         = express.Router();

Router.get('/', (req, res, next) => {
    res.render('index');
  });


  
module.exports = Router;