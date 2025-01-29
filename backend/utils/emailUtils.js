
const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
    service:"gmail",
    auth:{
      user:"theguywhoapproves@gmail.com",
      pass: "bkpt okmx dkfh frmu"
    },
  })
  
  const sendMail = (user) =>{
    const mailOptions = {
      from: "theguywhoapproves@gmail.com",
      to: user.email,
      subject: "Kindly send your resume/company profile for review",
      text:`Greetings, This is email has been sent to setup a review for your application under the username:${user.username}.Kindly attach your original resume/company profile for manual approval.` 
    }
    transport.sendMail(mailOptions, (error, info) => {
      if(error){
        return console.log(error);
      }
      else console.log(info);
    });
  }
  module.exports = { sendMail };