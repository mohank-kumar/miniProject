const Userservice = require("../services/user.service");
const {otpExpiryTime, generateOtp, forgotHtml, writeFile, readFile} = require("../utils/function.utils");
const sendMail = require("../utils/mail.utils");
const {customAlphabet}= require("nanoid");
const { v4: uuidv4 } = require("uuid");
const nanoid = customAlphabet('1234567890', 6);
const path = require('path');

const register = async(req, res) => {
    try{
    const findUser = await Userservice.getSingleUser({email:req.body.email, roles: req.body.roles});
    if(findUser){
        return res.status(400).send({error: "User already exist"});
    }
    let password = await Userservice.generatePassword(req.body.password);
    req.body.password = password;
    let dateofbirth = await Userservice.dateOfBirthFormat(req.body.dateofbirth);
    req.body.dateofbirth = dateofbirth;
    let username = req.body.firstname + '' + req.body.lastname;
    req.body.username = username;
    const createUser = await Userservice.createUser(req.body);
    if(createUser){
        const otp = nanoid();
        const expiryTime = await otpExpiryTime(new Date(), parseInt(process.env.OTP_EXPIRY_TIME));
        const html = generateOtp(createUser.username, otp);
        const mail = await sendMail(req.body.email, "Account Verification Password", html);
        if(!mail){
            return res
            .status(400)
            .send({ message: "Failed to send verification link." });
        }
        const update = await Userservice.editUser(createUser._id, {otp: otp, otpexpiriytime: expiryTime});
        if(!update){
            return res.status(400).send({ message: "Failed to update otp." });
        }
        return res.status(200).send({
            message: "Verification otp sent to your registered email.",
            data: createUser
          });
    }
}catch(err){
    console.log("error", err);
    return res.status(500).send({message: "Failed to create user", err: err});
}}

const login = async(req, res) => {
    try{
        const user = await Userservice.getSingleUser({
           email:req.body.email
    });
          if (!user) {
            return res.status(404).send({ message: "User not found." });
          }
          if(user.isActive === false) {
            return res.status(404).send({ message: "User not found." });
          }
          const isValid = await Userservice.comparePassword(
            req.body.password,
            user.password
          );
          if (!isValid)
            return res.status(400).send({ message: "Incorrect password." });
          if (!user.confirmed)
            return res.status(400).send({ message: "Email not verified." });
          const token = await Userservice.generateToken({
            id: user._id,
            email: user.email,
            roles: user.roles
          });
          let response = {
            token,
            user: { role: user.roles },
          };
          return res
            .status(200)
            .send({ message: "User logged in successfully", data: response }); 

    }catch(err){
        console.log("error", err);
    return res.status(500).send({message: "Failed to login", err: err});
    }
}

 // Confirm email
const confirmEmail = async (req, res) => {
    try {
      const user = await Userservice.getSingleUser({
       email: req.body.email
    });
      if (!user) return res.status(404).send({ message: "User not found." });
      if (user.otp && user.otp === req.body.otp) {
        if (user.otpexpiriytime < new Date()) {
          return res.status(400).send({ message: "OTP Expired" });
        }
        const update = await Userservice.editUser(user._id, {
          confirmed: true,
          otp: null,
        });
        if (update) return res.status(200).send({ message: "User confirmed." });
        return res
          .status(400)
          .send({ message: "Failed to update confirm user." });
      } else {
        return res.status(400).send({ message: "Invalid OTP." });
      }
    } catch (err) {
      return res
        .status(400)
        .send({ message: "Failed to update confirm user.", err: err });
    }
  }

const resendVerification = async(req, res) => {
    try{
        const user = await Userservice.getSingleUser({email:req.body.email});
        if (!user) return res.status(404).send({ message: "User not found." });
        if (user.confirmed)
          return res.status(400).send({ message: "Email already verified." });
        const otp = nanoid();
        const expiry_time = await otpExpiryTime(
          new Date(),
          parseInt(process.env.OTP_EXPIRY_TIME)
        );
        const html = generateOtp(user.username, otp);
        const mail = await sendMail(
          req.body.email,
          "Account Verification Password.",
          html
        );
        if (!mail)
          return res
            .status(400)
            .send({ message: "Failed to send verification email." });
        const update = await Userservice.editUser(user._id, {
          otp: otp,
          otp_expiry_time: expiry_time,
        });
        if (!update)
          return res.status(400).send({ message: "Failed to update otp." });
        return res.status(200).send({
          message: "Verification OTP sent to your registered email.",
        });
    }catch(err){
        return res
        .status(400)
        .send({ message: "Failed to update confirm user.", err: err });
    }
}

 // Forgot password
const forgotPassword = async (req, res) => {
    try {
      const user = await Userservice.getSingleUser({email:req.body.email});
      if (!user) return res.status(404).send({ message: "User not found." });
      const otp = nanoid();
      const expiry_time = await otpExpiryTime(
        new Date(),
        parseInt(process.env.OTP_EXPIRY_TIME)
      );
      const html = await forgotHtml(user.username, otp);
      const mail = await sendMail(user.email, "Forgot Password", html);
      if (!mail)
        return res
          .status(400)
          .send({ message: "Failed to send forgot password email." });
      const update = await Userservice.editUser(user._id, {
        otp: otp,
        otpexpiriytime: expiry_time,
      });
      if (!update)
        return res.status(400).send({ message: "Failed to update OTP." });
      return res
        .status(200)
        .send({ message: "OTP sent to your registered email." });
    } catch (err) {
      console.log("err", err);
      return res
        .status(400)
        .send({ message: "Failed to send forgot password.", err: err });
    }
  }

 const verifyOtp = async (req, res) => {
    try {
      const user = await Userservice.getSingleUser({email: req.body.email});
      if (!user) return res.status(404).send({ message: "User not found." });
      if (user.otp && user.otp === req.body.otp) {
        if (user.otpexpiriytime < new Date()) {
          return res.status(400).send({ message: "OTP Expired." });
        }
        const hash = uuidv4();
        const update = await Userservice.editUser(user._id, {
          otp: null,
          forgot_password_hash: hash,
        });
        if (update)
          return res.status(200).send({
            message: "OTP verified.",
            data: { forgot_password_hash: hash },
          });
        return res
          .status(400)
          .send({ message: "Failed to update confirm user." });
      } else {
        return res.status(400).send({ message: "Invalid OTP." });
      }
    } catch (err) {
        console.log("error", err);
      return res
        .status(400)
        .send({ message: "Failed to verify otp.", err: err });
    }
  }

const resetPassword =  async (req, res) => {
    try {
      const user = await Userservice.getSingleUser({
        forgot_password_hash: req.body.hash,
      });
      if (!user) return res.status(404).send({ message: "User not found." });
      if (
        user.forgot_password_hash &&
        user.forgot_password_hash === req.body.hash
      ) {
        const password = await Userservice.generatePassword(req.body.password);
        const update = await Userservice.editUser(user._id, {
          forgot_password_hash: null,
          password: password,
        });
        if (!update)
          return res
            .status(400)
            .send({ message: "Failed to update password." });
        return res.status(200).send({ message: "Password updated." });
      }
      return res.status(400).send({ message: "Invalid request" });
    } catch (err) {
      return res
        .status(400)
        .send({ message: "Failed to reset password.", err: err });
    }
  }

const changePassword = async (req, res) => {
    try {
      const user = await Userservice.getSingleUser({_id: req.user.id});
      const isValid = await Userservice.comparePassword(
        req.body.old_password,
        user.password
      );
      if (!isValid)
        return res.status(400).send({ message: "Invalid old password." });
      const hash = await Userservice.generatePassword(req.body.password);
      const update = await Userservice.editUser(user._id, { password: hash });
      if (!update) {
        return res.status(400).send({ message: "Failed to update password." });
      }
      return res.status(200).send({ message: "Password updated." });
    } catch (err) {
      return res
        .status(400)
        .send({ message: "Failed to update password.", err: err });
    }
  }

const getSingleUser = async(req, res) => {
    try{
        const findUser = await Userservice.getSingleUser({_id: req.user.id});
        if(!findUser){
            return res.status(404).send({message: "User not found"});
        }
        return res.status(200).send({message: "User found", data: findUser});
    }catch(err){
        return res
        .status(400)
        .send({ message: "Failed to get user.", err: err });
    }

}

const updateUser = async(req, res) => {
    try{
        let username = req.body.firstname + " " + req.body.lastname;
        req.body.username = username;
        const update = await Userservice.editUser({_id:req.user.id}, req.body);
        if (update) {
          return res.status(200).send({ message: "Account details updated." });
        }
        return res
          .status(400)
          .send({ message: "Failed to update account details." });

    }catch(err){
        return res
        .status(400)
        .send({ message: "Failed to update account details.", err: err });
    }
}

const deleteUser = async(req, res) => {
    try{
        const deleteUser = await Userservice.deleteUser({_id: req.user.id}, {isActive: false});
        if(deleteUser){
            return res.status(200).send({message: "Account deleted"});
        }
        return res.status(200).send({message: "Failed to delete account"});
    }catch(err){
        return res
        .status(400)
        .send({ message: "Failed to delete account.", err: err });
    }
}

const profilePictureUpload = async (req, res) => {
  try{
    const file = req.files.files;
    const filePath = `public/images/${req.user.id}.jpg`;
    const uploadfile = await file.mv(filePath);
    if(uploadfile){
      const updateProfilePicture = await Userservice.editUser({_id:req.user.id}, {image: filePath} );
      if(updateProfilePicture){
      return res.status(200).send({message: "Profile picture updated successfully."});
    }
    }
    return res.status(400).send({message: "Profile picture not updated."});
  }catch(err){
    console.log("error", err);
    return res
    .status(500)
    .send({ message: "Failed to upload profile picture.", err: err });
  }
}




module.exports = {
    register,
    login,
    confirmEmail,
    resendVerification,
    forgotPassword,
    verifyOtp,
    resetPassword,
    changePassword,
    getSingleUser,
    updateUser,
    deleteUser,
    profilePictureUpload
}