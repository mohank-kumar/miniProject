const fs = require("fs");
const path = require("path");

const otpExpiryTime = async(date, minutes) => {
    const addedTime = new Date(date.getTime() + minutes * 60000 );
    return addedTime;
}

const generateOtp = (name, otp) => {
    const html = `<p><span style='font-weight:bold;'>Hi ${name},</span><br> Your one time password for <span style='font-weight:bold;'>Day Best</span> is<br><span style='font-weight:bold;font-size: 20px;'>${otp}</span><br>It will expire in 5 mins. do not share with any one!</p>`;
    return html;
  };

const forgotHtml = (name, otp) => {
    const html = `<p><span style='font-weight:bold;'>Hi ${name},</span><br>You have requested to reset the password of your <span style='font-weight:bold;'>Day Best </span>account.<br>Please find the OTP to change your password.It will expire in 10 mins. do not share with any one!<br><span style='font-weight:bold;font-size: 20px;text-align: center;'>${otp}</span></p>`;
    return html;
};

module.exports = {
    otpExpiryTime,
    generateOtp,
    forgotHtml,
    readFile,
    writeFile
}