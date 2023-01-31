const nodemailer = require('nodemailer');

class Mail {
    constructor(to, subject, text) {
    this.to = to;
    this.subject = subject;
    this.text = text;
}

sendEmail() {
    let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    user: 'gargaretm300@gmail.com',
    pass: 'dybqgduyphqtxvkn'
}
});
let mailOptions = {
    from: 'gargaretm300@gmail.com',
    to: this.to,
    subject: this.subject,
    text: this.text
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
}

module.exports = Mail;
