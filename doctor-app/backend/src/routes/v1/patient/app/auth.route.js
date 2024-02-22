/* ------------------------------- DEFINE AREA ------------------------------ */
const express = require("express");
const router = express.Router();
const {
  refreshToken,
  accessToken,
} = require("../../../../middleware/patientAuth");
const {
  authPatientController,
  updatePatientController,
  homeScreenPatientController,
  doctorDetailController,
} = require("../../../../controllers");
const { singleFileUpload } = require("../../../../helpers/upload");

/* -------------------------- REGISTER/CREATE PATIENT -------------------------- */
router.post(
  "/create-patient",
  // accessToken(),
  authPatientController.register
);
/* -------------------------- LOGIN/SIGNIN USER  0-new 1-already -------------------------- */
router.post(
  "/login",
  // accessToken(),
  authPatientController.login
);
/* --------------------- FORGOT PASSWORD SEND WITH EMAIL -------------------- */
router.post(
  "/forgotpass",
  // accessToken(),
  authPatientController.forgotPass
);
/* ----------------------- VERIFICATION OTP WITH EMAIL ---------------------- */
router.post(
  "/verify-otp",
  //  accessToken(),
  authPatientController.verifyOtp
);
/* ----------------------------- reset password ----------------------------- */
router.put(
  "/resetPassword",
  //  accessToken(),
  authPatientController.resetPassword
);
/* ----------------------------- CHANGE PASSWORD ---------------------------- */
router.post(
  "/change-password",
  //  accessToken(),
  authPatientController.changePassword
);

/* ------------------------- UPDATE PATEINT PROFILE ------------------------- */
router.put(
  "/update-patient-profile",
  // accessToken(),
  singleFileUpload("/patientImag", "image"),
  updatePatientController.updatepatientProfile
);
/* ------------------------- DELETE PATIENT PROFILE ------------------------- */
router.delete(
  "/delete-patient/:patientId",
  // accessToken(),
  updatePatientController.deletePatient
);

/* ----------------------------- All Doctor List Rating Wise Filter ----------------------------- */
router.get(
  "/docotr-list",
  // accessToken(),
  homeScreenPatientController.allDoctorList
);

/* -------------- All Specilaist List At Home Screen Of Patient ------------- */
router.get(
  "/specialist-list",
  // accessToken(),
  homeScreenPatientController.allSpecialList
);
/* ----------- SEARCH FILTER WITH CITY AND SPECIALIST(SEARCH API) ----------- */
router.get(
  "/search-specialist-city",
  // accessToken(),
  homeScreenPatientController.searchDoctorSpecialist
);

/* ---------------------------- DETAILS OF DOCTOR --------------------------- */
router.get(
  "/list-doctor-id",
  // accessToken(),
  doctorDetailController.allDoctorListById
);

module.exports = router;
