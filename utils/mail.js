const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");

const sendMail = async ({ to, subject, text }) => {
  let transporter;
  // for production use sendgrid
  if (process.env.NODE_ENV == "production") {
    transporter = nodemailer.createTransport(
      sgTransport({
        auth: {
          api_key: process.env.SENDGRID_PASS,
        },
      })
    );
  } else {
    // for development use mailtrap
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  const message = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to,
    subject,
    text,
  };

  await transporter.sendMail(message);
};

module.exports = sendMail;
