;
const express = require("express");

const router = express.Router();
const {
  refreshToken,
  accessToken,
} = require("../../../../middleware/doctorAuth");
const {  favoriteDoctorController } = require("../../../../controllers");
// const { singleFileUpload } = require("../../../../helpers/upload");

router.post(
    "/add-favorite-doctor",
    favoriteDoctorController.createFavoriteDoctor
  );


router.get(
  "/list",
  favoriteDoctorController.getFavoriteDoctorList
);


// router.get(
//   "/list-doctor-id",
//   appointmentController.getAppointmentById
// );
  

module.exports = router;
