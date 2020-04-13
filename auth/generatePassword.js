const bcrypt = require("bcrypt");
const bcryptSalt = 10;


function generatePassword() {
   
const randomPassword = Math.random().toString(36).slice(-8);
const salt     = bcrypt.genSaltSync(bcryptSalt);
const hashPass = bcrypt.hashSync(randomPassword, salt);

const objPassword = {plain:randomPassword ,hash: hashPass}

return objPassword;

  }
  
  module.exports = generatePassword;
  