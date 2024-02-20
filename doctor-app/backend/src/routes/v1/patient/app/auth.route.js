const express = require("express");

const router = express.Router();
const {
  refreshToken,
  accessToken,
} = require("../../../../middleware/doctorAuth");
const { authPatientController, updatePatientController, homeScreenPatientController, doctorDetailController } = require("../../../../controllers");
const { singleFileUpload } = require("../../../../helpers/upload");

router.post("/create-patient", authPatientController.register);

router.post("/login", authPatientController.login);

router.post("/forgotpass", authPatientController.forgotPass);

router.post("/verify-otp", authPatientController.verifyOtp);

router.put(
  "/resetPassword",
  //  accessToken(),
  authPatientController.resetPassword
);

router.post("/change-password", authPatientController.changePassword);

router.put(
  "/update-patient-profile",
  singleFileUpload("/patientImag", "image"),
  updatePatientController.updatepatientProfile
);

router.get("/docotr-list", homeScreenPatientController.allDoctorList)
router.get("/specialist-list", homeScreenPatientController.allSpecialList)
router.get("/search-specialist-city", homeScreenPatientController.searchDoctorSpecialist);

router.delete("/delete-patient/:patientId", updatePatientController.deletePatient);




/* ---------------------------- DETAILS OF DOCTOR --------------------------- */
router.get(
  "/list-doctor-id",
  doctorDetailController.allDoctorListById
); 


// router.put(
//   "/update-doctor-profile",
//   singleFileUpload("/doctorImg", "image"),
//   doctorController.updateDocProfile
// );

module.exports = router;
