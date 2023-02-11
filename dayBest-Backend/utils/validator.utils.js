const joi = require("joi");
const passwordPattern =
  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$/;

const registerSchema = joi.object().keys({
    firstname: joi.string().required().messages({
        "string.pattern.base": "First name must be a valid string"
    }),
    lastname: joi.string().required().messages({
        "string.pattern.base": "last name must be a valid string"
    }),
    address: joi.object({
        street: joi.string().optional(),
        village: joi.string().optional(),
        district: joi.string().optional(),
        pincode: joi.number().optional(),
    }),
    email: joi.string().email().required(),
    password: joi.string().pattern(passwordPattern).required().messages({
        "string.pattern.base":
          "password must contain at least eight characters, at least one number and both lower and uppercase letters and special characters.",
      }),
    dateofbirth: joi.string().optional(),
    phonenumber: joi.number().required().messages({
        "string.pattern.base": "Phone number must be valid"
    }),
    role: joi.string().required(),
    gender: joi.string().required()
})

const loginSchema = joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().required(),
  });
const confirmSchema = joi.object().keys({
    email: joi.string().email().required(),
    role: joi.string().required(),
    otp: joi.string()
      .regex(/^[0-9]{6}$/)
      .messages({ "string.pattern.base": `OTP must have 6 digits only.` })
      .required(),
  });

const emailSchema = joi.object().keys({
    email: joi.string().email().required(),
  });

  const resendSchema = joi.object().keys({
    email: joi.string().email().required(),
    role: joi.string().required()
  });
  
const verifyOtpSchema = joi.object().keys({
    email: joi.string().email().required(),
    otp: joi.string()
      .regex(/^[0-9]{6}$/)
      .messages({ "string.pattern.base": `OTP must have 6 digits only.` })
      .required(),
  });

  const resetPasswordSchema = joi.object().keys({
    hash: joi.string().required(),
    password: joi.string().pattern(passwordPattern).required().messages({
      "string.pattern.base":
        "password must contain at least eight characters, at least one number and both lower and uppercase letters and special characters.",
    }),
    confirm_password: joi.any()
      .equal(joi.ref("password"))
      .required()
      .label("Confirm password")
      .messages({ "any.only": "{{#label}} does not match" }),
  });

const changePasswordSchema = joi.object().keys({
    old_password: joi.string().required(),
    password: joi.string().pattern(passwordPattern).required().messages({
      "string.pattern.base":
        "password must contain at least eight characters, at least one number and both lower and uppercase letters and special characters.",
    }),
    confirm_password: joi.any()
      .equal(joi.ref("password"))
      .required()
      .label("Confirm password")
      .messages({ "any.only": "{{#label}} does not match" }),
  });

updateUserSchema = joi.object().keys({
    firstname: joi.string().required().messages({
        "string.pattern.base": "First name must be a valid string"
    }),
    lastname: joi.string().required().messages({
        "string.pattern.base": "last name must be a valid string"
    }),
    address: joi.object({
        street: joi.string().optional(),
        village: joi.string().optional(),
        district: joi.string().optional(),
        pincode: joi.number().optional(),
    }),
    dateofbirth: joi.string().optional(),
    phonenumber: joi.number().required().messages({
        "string.pattern.base": "Phone number must be valid"
    }),
    gender: joi.string().required()
})



module.exports = {
    registerSchema,
    loginSchema,
    confirmSchema,
    emailSchema,
    verifyOtpSchema,
    resetPasswordSchema,
    changePasswordSchema,
    updateUserSchema,
    resendSchema
}