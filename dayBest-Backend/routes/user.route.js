const express = require("express");
const router = express.Router();
const {Controller} = require("../controllers/index");
const validationMiddleware = require("../middlewares/validation.middleware");
const verifyToken = require("../middlewares/verify.middleware");
const {registerSchema, loginSchema, confirmSchema, emailSchema, resendSchema, verifyOtpSchema, resetPasswordSchema, changePasswordSchema, updateUserSchema} = require("../utils/validator.utils");

router.post("/", validationMiddleware(registerSchema), Controller.register);
router.post("/confirm",validationMiddleware(confirmSchema), Controller.confirmEmail);
router.post("/login", validationMiddleware(loginSchema) ,Controller.login);
router.post("/resendVerification",  validationMiddleware(resendSchema), Controller.resendVerification);
router.post("/forgotPassword",validationMiddleware(emailSchema),Controller.forgotPassword);
router.post("/verifyOtp", validationMiddleware(verifyOtpSchema), Controller.verifyOtp);
router.post("/resetPassword", validationMiddleware(resetPasswordSchema), Controller.resetPassword);
router.post("/changePassword", validationMiddleware(changePasswordSchema),verifyToken, Controller.changePassword);
router.get("/",verifyToken, Controller.getSingleUser);
router.patch("/",verifyToken, validationMiddleware(updateUserSchema),Controller.updateUser);
router.delete("/",verifyToken, Controller.deleteUser);
router.patch("/profile_picture", verifyToken, Controller.profilePictureUpload);


module.exports = router;