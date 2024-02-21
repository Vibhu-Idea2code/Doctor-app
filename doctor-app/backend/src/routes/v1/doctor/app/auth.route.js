const express = require("express");

const router = express.Router();
const {
  refreshToken,
  accessToken,
} = require("../../../../middleware/doctorAuth");
const { doctorController, authController } = require("../../../../controllers");
const { singleFileUpload } = require("../../../../helpers/upload");

router.post("/create-doctor", authController.register);

router.post("/login", authController.login);

router.post("/forgotpass", authController.forgotPass);

router.post("/verify-otp", authController.verifyOtp);

router.put(
  "/resetPassword",
  //  accessToken(),
  authController.resetPassword
);

router.post("/change-password", authController.changePassword);

router.put(
  "/update-doctor-profile",
  singleFileUpload("/doctorImg", "image"),
  doctorController.updateDocProfile
);



router.delete("/delete-doc/:doctorId", doctorController.deleteDoctor);
// router.get('/list',accessToken(),
// petController.getPetsList);

// router.get('/id/:petsId',
// petController.getPetsId);

// router.delete('/delete/:petsId',
// petController.deletePets);

// router.put('/update/:petsId',
// petController.updatePets);

// router.delete("/delete-many", petController.multipleDelete);

// router.put("/updatePetStatus/:id",petController.updatePetStatus);

module.exports = router;

// General
// Cardiologist
// Dentist
// Dermatologist
// Pediatrician
// Gynecologist
// Nutritionist
// Endocrinologist
// Psychiatrist
// Hematologist
// Ophthalmologist
// Oncologist
// Orthopedic
// Urologist
// Neurologist
