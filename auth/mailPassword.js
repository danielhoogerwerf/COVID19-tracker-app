const nodemailer = require('nodemailer');
const Users = require("../models/users");
const generatePassword = require('../auth/generatePassword')


async function mailPassword(userID,username) {
  
    const password = generatePassword()
    
    // Update the Password in the database
    Users.findOneAndUpdate(
      {_id:userID},
       {password:password.hash,passwordflag:true})
      .then(user => console.log('User:',user))
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: 'gmail',    
      auth: {
        user: 'dutchcovid19tracker@gmail.com', // generated ethereal user
        pass: process.env.GMAIL // generated ethereal password
      }
    });
  
    // send mail with defined transport object
    let mailOptions = await transporter.sendMail({
      from: 'dutchcovid19tracker@gmail.com', // sender address
      to: username, // list of receivers
      subject: "Your COVI-19 password", // Subject line
      text: `This is your COVI-19 new password: ${password.plain}`, // plain text body
      html: `This is your COVI-19 new password: ${password.plain}` // html body
    });
  
    transporter.sendMail(mailOptions, function (err, info) {
      if(err)
        console.log(err)
      else
        console.log(info);
   });
  }





  module.exports = mailPassword;