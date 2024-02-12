const express = require("express");

const router = express.Router();
const {
  refreshToken,
  accessToken,
} = require("../../../../middleware/doctorAuth");
const { authPatientController } = require("../../../../controllers");
const { singleFileUpload } = require("../../../../helpers/upload");

router.post("/create-patient",authPatientController.register);

router.post("/login",authPatientController.login);

router.post("/forgotpass",authPatientController.forgotPass);

router.post("/verify-otp",authPatientController.verifyOtp);

router.put(
  "/resetPassword",
  //  accessToken(),
  authPatientController.resetPassword
);

// router.put(
//   "/update-doctor-profile",
//   singleFileUpload("/doctorImg", "image"),
//   doctorController.updateDocProfile
// );


module.exports = router;