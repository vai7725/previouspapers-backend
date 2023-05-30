// package
require('dotenv').config();
const mailer = require('nodemailer');
const mailGen = require('mailgen');

// variables
const senderEmail = process.env.EMAIL;
const senderEmailPass = process.env.EMAIL_PASSWORD;

const sendMail = (req, res) => {
  const { recepientEmail, emailBody } = req.body;
  const config = {
    service: 'gmail',
    auth: {
      user: senderEmail,
      pass: senderEmailPass,
    },
  };

  let transporter = mailer.createTransport(config);

  const mail = {
    from: senderEmail,
    to: recepientEmail,
    subject: emailBody.subject,
    html: emailBody.body,
  };

  transporter
    .sendMail(mail)
    .then(() => {
      return res.status(201).json({ msg: 'Mail has been sent' });
    })
    .catch((err) => res.status(500).json({ err }));
};

module.exports = sendMail;
