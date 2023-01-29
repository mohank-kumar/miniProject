const nodeMailer = require("nodemailer");
require("dotenv").config();
// smtp configurations to send OTP
const sendMail = async (email, subject, body) => {
  try {
    const mail = nodeMailer.createTransport({
      port: 465,
      service: "gmail",
      host: "smtp.gmail.com",
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let info = await mail.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      html: body,
    });
    return info;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = sendMail;
