const express        = require("express");
const adminRouter = express.Router();

adminRouter.get('/', (req, res, next) => {

    res.render('admin-dashboard/index');
  });
  
module.exports = adminRouter;