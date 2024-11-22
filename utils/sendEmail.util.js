const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key: process.env.SENDGRID_KEY,
    },
  })
);

const sendEmail = (toEmail, fromEmail, subject, content) => {
  transporter.sendMail({
    to: toEmail,
    from: fromEmail,
    subject: subject,
    html: content,
  });
};

module.exports = sendEmail;
