const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {type: String},
    firstname: {type: String},
    lastname : {type: String},
    address: {
        street: {type: String},
        village: {type: String},
        district: {type: String},
        state: {type: String},
        pincode: {type: Number}
    },
    email: {type: String, required: true},
    password: {type: String, required: true},
    dateofbirth: {type: String},
    phonenumber: {type: Number, required: true},
    image: {type: String},
    roles: {type: String, enum: ['FARMER', 'USER', 'ADMIN']},
    gender: {type: String, enum: ['Female','Male', 'Transgender']},
    isActive: {type: Boolean, default: true},
    isDeleted: {type: Boolean, default: false},
    otp: {type: String, minLength: 6, maxLingth: 6},
    otpexpiriytime: {type: Date},
    confirmed: { type: Boolean, default: false },
    forgot_password_hash: {type: String},
    image: {data: Buffer, required: true}
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);


const user = mongoose.model("users", userSchema);

module.exports = user;
