const bcrypt = require('bcrypt');
const moment = require('moment')
const mongoose = require('mongoose');
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const createUser = async (data) => {
    try{
        const createUser = await User.create(data);
        return createUser;
    }catch(err){
        throw new Error(err);
    }
}

const getSingleUser = async (data) => {
    try{
        const createUser = await User.findOne(data);
        return createUser;
    }catch(err){
        throw new Error(err);
    }
}

const generatePassword = async (password) => {
    try {
      const hash = await bcrypt.hash(
        password,
        parseInt(process.env.BCRYPT_SALT_ROUND)
      );
      return hash;
    } catch (err) {
      throw new Error(err);
    }
  }

const dateOfBirthFormat = async(date) => {
    try {
        const dateofbirth = moment(date).format("DD/MM/YYYY");
        return dateofbirth;
      } catch (err) {
        throw new Error(err);
      }
  }

 const editUser =  async (id, data) => {
    try {
      const update = await User.updateOne({ _id: id }, data);
      if (update.modifiedCount === 0) {
        return false;
      }
      return true;
    } catch (err) {
      throw new Error(err);
    }
  }

const deleteUser = async (id, data) => {
  try {
    const update = await User.updateOne({ _id: id }, data);
    if (update.modifiedCount === 0) {
      return false;
    }
    return true;
  } catch (err) {
    throw new Error(err);
  }
}

  
// Compare password
const  comparePassword = async (password, hash) => {
      try {
        const isValid = await bcrypt.compare(password, hash);
        return isValid;
      } catch (err) {
        throw new Error(err);
      }
    }

// Generate JWT token
const generateToken = async (payload) => {
    try {
      const token = await jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
      });
      return token;
    } catch (err) {
      throw new Error(err);
    }
  }
  
module.exports = {
    createUser,
    getSingleUser,
    generatePassword,
    dateOfBirthFormat,
    editUser,
    comparePassword,
    generateToken,
    deleteUser
}

