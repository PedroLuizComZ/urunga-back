const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "app.urunga@gmail.com",
    pass: "hvldbafwtzccdmyf",
  },
});

module.exports = transporter;
